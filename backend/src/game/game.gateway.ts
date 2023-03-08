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
} from './types/game.model';
import * as GameSetting from './constants';
import { deepCopy } from './utility';
import { updateMatch, isMatchSet } from './logic';
import { MatchService } from 'src/match/match.service';
import { UsersService } from '../users/users.service';

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
  private connectedClients: Map<string, Socket> = new Map<string, Socket>();
  private userQueue: IUserQueue[] = [];

  afterInit(_server: Server) {
    this.logger.log('初期化しました。');
    this.loop();
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.userQueue = this.userQueue.filter(
      (element) => !(element.clientId === client.id),
    );
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
        });
        if (isMatchSet(match.leftPlayer.score, match.rightPlayer.score)) {
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
          this.userService.updateMatchHistory(winner.id, 'wins');
          this.userService.updateMatchHistory(loser.id, 'losses');
          map.delete(key);
        }
      });
    }, 1000 / 60);
  }

  @SubscribeMessage('matching')
  async handleMatching(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; userName: string },
  ): Promise<void> {
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
          newMatch.leftPlayer.socketID = leftSocket.id;
          newMatch.leftPlayer.name = leftUser.userName;
          newMatch.leftPlayer.id = leftUser.userId;
          newMatch.rightPlayer = deepCopy(GameSetting.initRightProfile);
          newMatch.rightPlayer.socketID = rightSocket.id;
          newMatch.rightPlayer.name = rightUser.userName;
          newMatch.rightPlayer.id = rightUser.userId;
          if (leftSocket !== undefined) leftSocket.join(res.id.toString());
          if (rightSocket !== undefined) rightSocket.join(res.id.toString());
          this.server.to(res.id.toString()).emit('updateConnections', newMatch);
        })
        .catch((reason) => this.logger.log(reason));
    }
  }

  @SubscribeMessage('matchingCancel')
  handleMatchingCancel(@MessageBody() userName: string): void {
    this.userQueue = this.userQueue.filter(
      (element) => !(element.userName === userName),
    );
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
    for (const [_key, match] of this.serverMatches) {
      if (
        match.leftPlayer !== undefined &&
        match.leftPlayer.name === data.userName
      ) {
        match.leftPlayer.socketID = client.id;
        client.join(match.id.toString());
      } else if (
        match.rightPlayer !== undefined &&
        match.rightPlayer.name === data.userName
      ) {
        match.rightPlayer.socketID = client.id;
        client.join(match.id.toString());
      } else if (match.id === data.matchID) {
        // もし観戦しようとしていたら。
        // defaultはmatch.id = 0なので観戦しようとする時だけmatch.id > 0
        client.join(match.id.toString());
      } else continue;
      currentMatch = match;
      break;
    }
    if (currentMatch === undefined)
      this.server.to(client.id).emit('updateConnections');
    else this.server.to(client.id).emit('updateConnections', currentMatch);
  }

  @SubscribeMessage('updateSpeed')
  handleUpdateSpeed(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchID: number; difficultyTitle: string },
  ): void {
    const match = this.serverMatches.get(data.matchID);
    if (match === undefined) return;
    switch (data.difficultyTitle) {
      case 'Easy':
        match.speed = 400;
        break;
      case 'Medium':
        match.speed = 600;
        break;
      case 'Hard':
        match.speed = 800;
        break;
      default:
        return;
    }
    this.server
      .to(match.id.toString())
      .emit('updateSpeed', data.difficultyTitle);
  }
}
