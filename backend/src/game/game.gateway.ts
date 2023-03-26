import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  IMatch,
  IPaddle,
  EStatus,
  IUserQueue,
  IScore,
  IClient,
} from './types/game.model';
import * as GameSetting from './constants';
import {
  decideEndScore,
  decidePaddleSize,
  decideSpeed,
  deepCopy,
} from './utility';
import { updateMatch, isMatchSet } from './logic';
import { MatchService } from 'src/match/match.service';
import { UsersService } from '../users/users.service';
import { UserMatchHistoryDto } from '../common/dto/users.dto';
import { initPaddle, PowerUP } from './constants';

@WebSocketGateway(3002, { namespace: 'game', cors: { origin: '*' } })
export class GameGateway {
  constructor(
    private readonly matchService: MatchService,
    private readonly userService: UsersService,
  ) {}
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('GameGateway');

  private serverMatches: Map<number, IMatch> = new Map<number, IMatch>();
  private connectedClients: Map<string, IClient> = new Map<string, IClient>();
  // <userName, socketId>
  private matchedUsers: Map<string, string> = new Map<string, string>();
  private connectedUsers: Map<string, IUserQueue> = new Map<
    string,
    IUserQueue
  >();
  private userQueue: IUserQueue[] = [];

  afterInit(_server: Server) {
    this.logger.log('初期化しました。');
    this.loop();
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, { socket: client, userName: '' });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.userQueue = this.userQueue.filter(
      (element) => !(element.clientId === client.id),
    );
    const user = this.connectedClients.get(client.id);
    if (this.matchedUsers.has(user.userName)) {
      this.matchedUsers.set(user.userName, '');
    }
    this.connectedClients.delete(client.id);
  }

  private countdown(matchID: string, seconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.server.to(matchID).emit('updateCountDown', seconds);
      const intervalId = setInterval(() => {
        this.server.to(matchID).emit('updateCountDown', --seconds);

        if (seconds === 0) {
          clearInterval(intervalId);
          resolve();
        }
      }, 1000);
    });
  }

  private loop() {
    setInterval(() => {
      this.serverMatches.forEach((match, key, map) => {
        if (match.status === EStatus.none) return;
        const matchId = match.id.toString();
        const currentTime = Date.now();
        const deltaTime = (currentTime - match.lastFrameTime) / 1000;
        match.lastFrameTime = currentTime;
        if (match.status === EStatus.play)
          updateMatch(
            match,
            deltaTime,
            (id: string, score: IScore, status: EStatus) => {
              this.server.to(id.toString()).emit('updateStatus', status);
              this.server.to(id.toString()).emit('updateScore', {
                left: score.left,
                right: score.right,
              });
            },
          );

        if (match.status === EStatus.pause) {
          match.elapsedTime += deltaTime;
          if (match.elapsedTime >= 0.9) {
            match.status = EStatus.play;
            this.server.to(matchId).emit('updateStatus', match.status);
            match.elapsedTime = 0;
          }
        }

        this.server.to(matchId).emit('updateBall', match.ball);
        this.server.to(matchId).emit('updatePaddle', {
          leftPaddle: match.leftPlayer.paddle,
          rightPaddle: match.rightPlayer.paddle,
          paddleSize: match.settings.paddleSize,
        });
        if (isMatchSet(match)) {
          match.status = EStatus.set;
          this.server.to(matchId).emit('updateConnections', match);
          this.server.to(matchId).emit('updateStatus', match.status);
          const winner =
            match.leftPlayer.score > match.rightPlayer.score
              ? match.leftPlayer
              : match.rightPlayer;
          const loser =
            winner === match.leftPlayer ? match.rightPlayer : match.leftPlayer;
          this.matchService
            .postMatchResult({
              id: match.id,
              winner: winner.id,
            })
            .catch((reason) => {
              this.logger.log(reason);
            });
          this.userService.updateUserMatchHistory(winner.id, 'wins');
          this.userService.updateUserMatchHistory(loser.id, 'losses');
          this.matchedUsers.delete(match.leftPlayer.name);
          this.matchedUsers.delete(match.rightPlayer.name);
          map.delete(key);
        }
      });
    }, 1000 / 60);
  }

  private async createMatch(leftUser: IUserQueue, rightUser: IUserQueue) {
    const leftHist: UserMatchHistoryDto =
      await this.userService.getUserMatchHistory(leftUser.userId);
    const rightHist: UserMatchHistoryDto =
      await this.userService.getUserMatchHistory(rightUser.userId);
    this.matchService
      .createMatch({
        id: 0,
        p1: leftUser.userId,
        p2: rightUser.userId,
        winner: 0,
      })
      .then((res) => {
        const leftSocket = this.connectedClients.get(leftUser.clientId);
        const rightSocket = this.connectedClients.get(rightUser.clientId);
        this.serverMatches.set(res.id, deepCopy(GameSetting.initServerMatch));
        const newMatch = this.serverMatches.get(res.id);
        newMatch.id = res.id;
        newMatch.leftPlayer = deepCopy(GameSetting.initLeftProfile);
        newMatch.leftPlayer.socketID = leftSocket.socket.id;
        newMatch.leftPlayer.name = leftUser.userName;
        newMatch.leftPlayer.id = leftUser.userId;
        newMatch.leftPlayer.matchHistory = leftHist;
        newMatch.rightPlayer = deepCopy(GameSetting.initRightProfile);
        newMatch.rightPlayer.socketID = rightSocket.socket.id;
        newMatch.rightPlayer.name = rightUser.userName;
        newMatch.rightPlayer.id = rightUser.userId;
        newMatch.rightPlayer.matchHistory = rightHist;
        if (leftSocket !== undefined) leftSocket.socket.join(res.id.toString());
        if (rightSocket !== undefined)
          rightSocket.socket.join(res.id.toString());
        this.matchedUsers.set(leftUser.userName, leftUser.clientId);
        this.matchedUsers.set(rightUser.userName, rightUser.clientId);
        this.server.to(res.id.toString()).emit('updateConnections', newMatch);
      })
      .catch((reason) => this.logger.log(reason));
  }

  @SubscribeMessage('matching')
  async handleMatching(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; userName: string },
  ): Promise<void> {
    if (this.matchedUsers.has(data.userName)) {
      this.server.to(client.id).emit('inMatch');
      return;
    }
    const queuedUser = this.userQueue.filter(
      (user) => user.userId === data.userId,
    );
    if (queuedUser.length > 0) {
      this.server.to(client.id).emit('inQueue');
      return;
    }

    this.server.to(client.id).emit('matching');
    this.userQueue.push({
      clientId: client.id,
      userId: data.userId,
      userName: data.userName,
    });

    if (this.userQueue.length >= 2) {
      const leftUser = this.userQueue.shift();
      const rightUser = this.userQueue.shift();
      this.server
        .to(leftUser.clientId)
        .to(rightUser.clientId)
        .emit('matchFound');
      this.createMatch(leftUser, rightUser);
    }
  }

  @SubscribeMessage('matchingCancel')
  handleMatchingCancel(@MessageBody() userName: string): void {
    this.userQueue = this.userQueue.filter(
      (element) => !(element.userName === userName),
    );
  }

  @SubscribeMessage('loggedIn')
  handleLoggedIn(
    @ConnectedSocket() client: Socket,
    @MessageBody() loginUser: { id: number; name: string },
  ): void {
    this.connectedUsers.set(loginUser.name, {
      userId: loginUser.id,
      userName: loginUser.name,
      clientId: client.id,
    });
    // deleteは認証ができてから
  }

  @SubscribeMessage('inviteMatching')
  handleInviteMatching(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { inviter: string; invitee: string },
  ): void {
    const invitee = this.connectedUsers.get(data.invitee);
    if (invitee === undefined) return;

    if (this.userQueue.find((user) => user.userName === invitee.userName)) {
      // invitee is in queue already
      this.server.to(client.id).emit('inviteeInQueue', invitee.userName);
    } else if (this.matchedUsers.get(invitee.userName) !== undefined) {
      // invitee is in a match already
      this.server.to(client.id).emit('inviteeInMatch', invitee.userName);
    } else {
      // invitee is available
      this.server.to(invitee.clientId).emit('inviteMatching', data.inviter);
    }
  }

  @SubscribeMessage('inviteAccepted')
  handleInviteAccepted(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { inviter: string; invitee: string },
  ): void {
    const inviter = this.connectedUsers.get(data.inviter);
    const invitee = this.connectedUsers.get(data.invitee);
    if (inviter === undefined || invitee === undefined) {
      this.logger.log('招待マッチングが成立しませんでした');
      return;
    }
    this.server.to(inviter.clientId).to(invitee.clientId).emit('navigate');
    this.createMatch(inviter, invitee);
  }

  @SubscribeMessage('updatePaddle')
  handleUpdatePaddle(
    @MessageBody() data: { matchID: number; newPaddle: IPaddle },
  ): void {
    const match = this.serverMatches.get(data.matchID);
    if (match === undefined) return;
    if (data.newPaddle.id === 'left')
      match.leftPlayer.paddle.pos = data.newPaddle.pos;
    else if (data.newPaddle.id === 'right')
      match.rightPlayer.paddle.pos = data.newPaddle.pos;
  }

  @SubscribeMessage('updatePlayerReady')
  handleUpdatePlayerReady(
    @MessageBody() data: { matchID: number; userName: string },
  ): void {
    const match = this.serverMatches.get(data.matchID);
    if (match === undefined) return;
    if (data.userName === match.leftPlayer.name) match.leftPlayer.ready = true;
    else if (data.userName === match.rightPlayer.name)
      match.rightPlayer.ready = true;

    this.server.to(data.matchID.toString()).emit('updateConnections', match);

    if (match.leftPlayer.ready && match.rightPlayer.ready) {
      this.logger.log('game ready!');
      match.status = EStatus.ready;
      this.server.to(match.id.toString()).emit('updateStatus', match.status);
      setTimeout((): void => {
        this.countdown(match.id.toString(), 3).then(() => {
          match.status = EStatus.play;
          this.server
            .to(match.id.toString())
            .emit('updateStatus', match.status);
        });
      }, 200);
    }
  }

  @SubscribeMessage('updateConnections')
  handleUpdateConnections(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchID: number; userName: string },
  ): void {
    let currentMatch = undefined;
    this.connectedClients.set(client.id, {
      socket: client,
      userName: data.userName,
    });

    const matchedUserSocket = this.matchedUsers.get(data.userName);
    // ユーザーがマッチしていない場合（ビューワー）、
    // またはユーザーがマッチしているが切断されている場合にのみ、マッチを検索
    // matchedUserSocket === client.id is for strict mode strange behavior
    if (
      matchedUserSocket === undefined ||
      matchedUserSocket === '' ||
      matchedUserSocket === client.id
    ) {
      for (const [_key, match] of this.serverMatches) {
        if (
          match.leftPlayer !== undefined &&
          match.leftPlayer.name === data.userName
        ) {
          match.leftPlayer.socketID = client.id;
          this.matchedUsers.set(data.userName, client.id);
          client.join(match.id.toString());
        } else if (
          match.rightPlayer !== undefined &&
          match.rightPlayer.name === data.userName
        ) {
          match.rightPlayer.socketID = client.id;
          this.matchedUsers.set(data.userName, client.id);
          client.join(match.id.toString());
        } else if (match.id === data.matchID) {
          // もし観戦しようとしていたら。
          // defaultはmatch.id = 0なので観戦しようとする時だけmatch.id > 0
          client.join(match.id.toString());
        } else continue;
        currentMatch = match;
        break;
      }
    }

    if (currentMatch === undefined)
      this.server.to(client.id).emit('updateConnections');
    else this.server.to(client.id).emit('updateConnections', currentMatch);
  }

  @SubscribeMessage('updatePowerUp')
  handlePowerUp(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      matchID: number;
      type: string;
      difficulty: string;
    },
  ): void {
    const match = this.serverMatches.get(data.matchID);

    if (match === undefined) return;

    switch (data.type) {
      case PowerUP.Speed:
        match.speed = decideSpeed(data.difficulty);
        break;
      case PowerUP.Paddle:
        match.settings.paddleSize = decidePaddleSize(data.difficulty);
        match.leftPlayer.paddle = initPaddle(match.settings, 'left');
        match.rightPlayer.paddle = initPaddle(match.settings, 'right');
        break;
      case PowerUP.Score:
        match.settings.winScore = decideEndScore(data.difficulty);
        break;
    }
    this.server
      .to(match.id.toString())
      .emit('updatePowerUp', { type: data.type, difficulty: data.difficulty });
  }
}
