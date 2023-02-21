import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { IBall, IPaddle, IPlayer, UPlayer, Vector2 } from './types/game';

enum EStatus {
  none = 0,
  ready = 1,
  play = 2,
  pause = 3,
  set = 4,
}

const gameWinWid = 1000;
const gameWinHght = 600;
const ballPx = 20;
const winningScore = 3;
let status: EStatus = EStatus.none;
let speed = 400;

const paddleSize: Vector2 = {
  x: 8,
  y: 100,
};

const initBall: IBall = {
  pos: { x: gameWinWid / 2 - ballPx / 2, y: gameWinHght / 2 - ballPx / 2 },
  vel: { x: -1, y: 0.5 },
};

const initLeftPaddle: IPaddle = {
  pos: { x: gameWinWid / 20, y: gameWinHght / 2 - paddleSize.y / 2 },
  id: 'left',
  score: 0,
};

const initRightPaddle: IPaddle = {
  pos: {
    x: gameWinWid - (gameWinWid / 20 + paddleSize.x),
    y: gameWinHght / 2 - paddleSize.y / 2,
  },
  id: 'right',
  score: 0,
};

const initLeftProfile: IPlayer = {
  id: 'left',
  name: 'Player1',
  wins: 3,
  losses: 7,
  ready: false,
  paddle: undefined,
};

const initRightProfile: IPlayer = {
  id: 'right',
  name: 'Player2',
  wins: 13,
  losses: 17,
  ready: false,
  paddle: undefined,
};

const deepCpInitBall = (): IBall => {
  return JSON.parse(JSON.stringify(initBall)); // deep copy of Object
};

const deepCpInitPaddle = (paddle: IPaddle): IPaddle => {
  return JSON.parse(JSON.stringify(paddle)); // deep copy of Object
};

let serverBall: IBall = undefined;

let leftPlayerId: string;
let rightPlayerId: string;

let playersPaddle: Map<string, IPaddle> = new Map<string, IPaddle>();
let playersProfile: Map<string, IPlayer> = new Map<string, IPlayer>();

@WebSocketGateway(3002, { namespace: 'game', cors: { origin: '*' } })
export class GameGateway {
  // ballの処理↓

  private calculateTilt(relativePosBall: number): number {
    const absValFromPaddle = Math.abs(relativePosBall);
    let x = 0;
    /*
	  paddleの半分から80%だったら
	  paddleの半分から60%だったら...
	  xは大きくなれば傾きも大きくなる
	*/
    if (absValFromPaddle >= 0.9) {
      x = 0.8;
    } else if (absValFromPaddle >= 0.8) {
      x = 0.6;
    } else if (absValFromPaddle >= 0.6) {
      x = 0.4;
    } else if (absValFromPaddle >= 0.4) {
      x = 0.3;
    } else if (absValFromPaddle >= 0.2) {
      x = 0.2;
    } else {
      x = absValFromPaddle;
    }
    return relativePosBall < 0 ? -x : x;
  }

  private handlePaddleCollision(ball: IBall, paddle: IPaddle): void {
    const compositeVelocity = Math.sqrt(ball.vel.x ** 2 + ball.vel.y ** 2);
    ball.vel.y = this.calculateTilt(
      // ボールがパドルの何%で衝突したのか)
      (ball.pos.y + ballPx / 2 - (paddle.pos.y + paddleSize.y / 2)) /
        (paddleSize.y / 2),
    );
    ball.vel.x =
      ball.vel.x < 0
        ? Math.sqrt(compositeVelocity ** 2 - ball.vel.y ** 2)
        : -Math.sqrt(compositeVelocity ** 2 - ball.vel.y ** 2);
  }

  private isHitPaddle(ball: IBall, paddle: IPaddle): boolean {
    return (
      paddle.pos.x <= ball.pos.x + ballPx &&
      ball.pos.x <= paddle.pos.x + paddleSize.x &&
      paddle.pos.y <= ball.pos.y + ballPx &&
      ball.pos.y <= paddle.pos.y + paddleSize.y
    );
  }

  private wait(timeout: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  private updateBall(
    ball: IBall,
    deltaTime: number,
    speed: number,
    leftPaddle: IPaddle,
    rightPaddle: IPaddle,
  ): IBall {
    ball.pos.x += ball.vel.x * deltaTime * speed;
    ball.pos.y += ball.vel.y * deltaTime * speed;

    if (ball.pos.y <= 0 && ball.vel.y < 0) {
      ball.vel.y *= -1;
    } else if (ball.pos.y >= gameWinHght - ballPx && ball.vel.y > 0) {
      ball.vel.y *= -1;
    } else if (
      // goal hit
      ball.pos.x <= 0 ||
      ball.pos.x >= gameWinWid - ballPx
    ) {
      console.log('goal hit');
      status = EStatus.pause;
      this.server.emit('matchPause');
      if (ball.vel.x < 0) {
        leftPaddle.score++;
      } else {
        rightPaddle.score++;
      }
      ball.pos = deepCpInitBall().pos;
      ball.vel = deepCpInitBall().vel;
      ball.vel.x *= -1;
      setTimeout(() => {
        console.log('0.9たちました');

        this.server.emit('matchStart');
        status = EStatus.none;
      }, 900);
      //   this.wait(900).then(() => {
      //   });
      console.log('matchStart');
    } else if (
      // left paddle hit
      ball.vel.x < 0 &&
      this.isHitPaddle(ball, leftPaddle)
    ) {
      this.handlePaddleCollision(ball, leftPaddle);
    } else if (
      // right paddle hit
      ball.vel.x > 0 &&
      this.isHitPaddle(ball, rightPaddle)
    ) {
      this.handlePaddleCollision(ball, rightPaddle);
    }
    return ball;
  }

  // ballの処理↑

  @WebSocketServer()
  private server: Server;
  private intervalId: NodeJS.Timeout;
  private logger: Logger = new Logger('GameGateway');

  afterInit(_server: Server) {
    //初期化
    this.logger.log('初期化しました。');
  }

  private countdown(seconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.server.emit('updateCountDown', seconds);
      const intervalId = setInterval(() => {
        this.server.emit('updateCountDown', --seconds);

        if (seconds === 0) {
          clearInterval(intervalId);
          resolve();
        }
      }, 1000);
    });
  }

  private loop() {
    let lastFrameTime = Date.now();
    this.intervalId = setInterval(() => {
      const isMatchSet =
        playersPaddle.get(leftPlayerId).score >= winningScore ||
        playersPaddle.get(rightPlayerId).score >= winningScore;

      const currentTime = Date.now();
      const deltaTime = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;
      if (!isMatchSet && status !== EStatus.pause)
        serverBall = this.updateBall(
          serverBall,
          deltaTime,
          speed,
          playersPaddle.get(leftPlayerId),
          playersPaddle.get(rightPlayerId),
        );

      // クライアントにデータを送信する
      this.server.emit('updateBall', serverBall);
      this.server.emit('updatePaddle', Object.fromEntries(playersPaddle));
      if (isMatchSet) this.server.emit('matchSet');
    }, 1000 / 60);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
    if (playersPaddle.size === 0) {
      this.logger.log('first player joined');
      //creating player 1
      playersPaddle.set(client.id, deepCpInitPaddle(initLeftPaddle));
      playersProfile.set(client.id, {
        ...initLeftProfile,
        paddle: playersPaddle.get(client.id),
      });
      leftPlayerId = client.id;
    } else if (playersPaddle.size === 1) {
      this.logger.log('second player joined');
      //creating player 2
      playersPaddle.set(client.id, deepCpInitPaddle(initRightPaddle));
      playersProfile.set(client.id, {
        ...initRightProfile,
        paddle: playersPaddle.get(client.id),
      });
      rightPlayerId = client.id;
      this.server.emit('updatePaddle', Object.fromEntries(playersPaddle));
      serverBall = deepCpInitBall();
    } else if (playersPaddle.size > 1) {
      this.logger.log('too many players, bye');
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    clearInterval(this.intervalId);
    if (playersPaddle.has(client.id) && playersProfile.has(client.id)) {
      playersPaddle = new Map<string, IPaddle>();
      playersProfile = new Map<string, IPlayer>();
    }
  }

  @SubscribeMessage('updatePaddle')
  handleUpdatePaddle(@MessageBody() newPaddle: IPaddle): void {
    const paddle = playersPaddle.get(
      newPaddle.id === 'left' ? leftPlayerId : rightPlayerId,
    );
    if (paddle !== undefined) paddle.pos = newPaddle.pos;
  }

  @SubscribeMessage('updatePlayerReady')
  handleUpdatePlayerReady(@MessageBody() playerID: UPlayer): void {
    playersProfile.get(
      playerID === 'left' ? leftPlayerId : rightPlayerId,
    ).ready = true;

    this.server.emit('updateConnections', Object.fromEntries(playersProfile));

    if (
      playersProfile.get(leftPlayerId).ready &&
      playersProfile.get(rightPlayerId).ready
    ) {
      this.logger.log('game ready!');
      this.countdown(3).then(() => {
        this.server.emit('matchStart');
        this.loop();
      });
    }
  }

  @SubscribeMessage('updateConnections')
  handleUpdateConnections(@ConnectedSocket() client: Socket): void {
    if (leftPlayerId !== undefined && rightPlayerId !== undefined) {
      this.server
        .to(client.id)
        .emit('updateConnections', Object.fromEntries(playersProfile));
    }
  }

  @SubscribeMessage('updateSpeed')
  handleUpdateSpeed(
    @ConnectedSocket() client: Socket,
    @MessageBody() clientSpeed: number,
  ): void {
    speed = clientSpeed;
    this.server.emit('updateSpeed', speed);
  }
}
