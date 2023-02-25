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
  Vector2,
  IBall,
  IMatch,
  IPaddle,
  IPlayer,
  EStatus,
} from './types/game.model';

const gameWinWid = 1000;
const gameWinHght = 600;
const ballPx = 20;
const winningScore = 3;

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
};

const initRightPaddle: IPaddle = {
  pos: {
    x: gameWinWid - (gameWinWid / 20 + paddleSize.x),
    y: gameWinHght / 2 - paddleSize.y / 2,
  },
  id: 'right',
};

const deepCopy = (obj: object): any => {
  return JSON.parse(JSON.stringify(obj)); // deep copy of Object
};

const initLeftProfile: IPlayer = {
  id: 1,
  socketID: '',
  name: 'Player1',
  side: 'left',
  wins: 3,
  losses: 7,
  ready: false,
  paddle: deepCopy(initLeftPaddle),
  score: 0,
};

const initRightProfile: IPlayer = {
  id: 2,
  socketID: '',
  name: 'Player2',
  side: 'right',
  wins: 13,
  losses: 17,
  ready: false,
  paddle: deepCopy(initRightPaddle),
  score: 0,
};

const serverMatch: IMatch = {
  id: 1,
  leftPlayer: undefined,
  rightPlayer: undefined,
  ball: deepCopy(initBall),
  speed: 400,
  status: EStatus.none,
};

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
      serverMatch.status = EStatus.pause;
      this.server.emit('updateStatus', serverMatch.status);
      if (ball.vel.x < 0) {
        serverMatch.rightPlayer.score++;
      } else {
        serverMatch.leftPlayer.score++;
      }
      this.server.emit('updateScore', {
        left: serverMatch.leftPlayer.score,
        right: serverMatch.rightPlayer.score,
      });
      ball.pos = deepCopy(initBall).pos;
      ball.vel = deepCopy(initBall).vel;
      ball.vel.x *= -1;
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

  private isMatchSet(): boolean {
    return (
      serverMatch.leftPlayer.score >= winningScore ||
      serverMatch.rightPlayer.score >= winningScore
    );
  }

  private loop() {
    let lastFrameTime = Date.now();
    let elapsedTime = 0;
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;
      if (serverMatch.status === EStatus.play)
        serverMatch.ball = this.updateBall(
          serverMatch.ball,
          deltaTime,
          serverMatch.speed,
          serverMatch.leftPlayer.paddle,
          serverMatch.rightPlayer.paddle,
        );

      if (serverMatch.status === EStatus.pause) {
        elapsedTime += deltaTime;
        if (elapsedTime >= 0.9) {
          serverMatch.status = EStatus.play;
          this.server.emit('updateStatus', serverMatch.status);
          elapsedTime = 0;
        }
      }

      // クライアントにデータを送信する
      this.server.emit('updateBall', serverMatch.ball);
      this.server.emit('updatePaddle', {
        leftPaddle: serverMatch.leftPlayer.paddle,
        rightPaddle: serverMatch.rightPlayer.paddle,
      });
      if (this.isMatchSet()) {
        serverMatch.status = EStatus.set;
        this.server.emit('updateConnections', serverMatch);
        this.server.emit('updateStatus', serverMatch.status);
        clearInterval(this.intervalId);
      }
    }, 1000 / 60);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
    if (serverMatch.leftPlayer === undefined) {
      this.logger.log('first player joined');
      //creating player 1
      serverMatch.leftPlayer = deepCopy(initLeftProfile);
      serverMatch.leftPlayer.socketID = client.id;
      serverMatch.leftPlayer.name = client.id;
    } else if (serverMatch.rightPlayer === undefined) {
      this.logger.log('second player joined');
      //creating player 2
      serverMatch.rightPlayer = deepCopy(initRightProfile);
      serverMatch.rightPlayer.socketID = client.id;
      serverMatch.rightPlayer.name = client.id;
    } else {
      this.logger.log('too many players, bye');
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (
      serverMatch.leftPlayer === undefined ||
      serverMatch.rightPlayer === undefined ||
      (serverMatch.leftPlayer.socketID !== client.id &&
        serverMatch.rightPlayer.socketID !== client.id)
    )
      return;
    clearInterval(this.intervalId);
    serverMatch.leftPlayer = undefined;
    serverMatch.rightPlayer = undefined;
    serverMatch.ball = deepCopy(initBall);
    serverMatch.status = EStatus.none;
    this.server.emit('updateConnections', serverMatch);
  }

  @SubscribeMessage('updatePaddle')
  handleUpdatePaddle(@MessageBody() newPaddle: IPaddle): void {
    if (newPaddle.id === 'left')
      serverMatch.leftPlayer.paddle.pos = newPaddle.pos;
    else if (newPaddle.id === 'right')
      serverMatch.rightPlayer.paddle.pos = newPaddle.pos;
  }

  @SubscribeMessage('updatePlayerReady')
  handleUpdatePlayerReady(@MessageBody() clientSocketID: string): void {
    if (clientSocketID === serverMatch.leftPlayer.socketID)
      serverMatch.leftPlayer.ready = true;
    else if (clientSocketID === serverMatch.rightPlayer.socketID)
      serverMatch.rightPlayer.ready = true;

    this.server.emit('updateConnections', serverMatch);

    if (serverMatch.leftPlayer.ready && serverMatch.rightPlayer.ready) {
      this.logger.log('game ready!');
      serverMatch.status = EStatus.ready;
      this.server.emit('updateStatus', serverMatch.status);
      setTimeout((): void => {
        this.countdown(3).then(() => {
          serverMatch.status = EStatus.play;
          this.server.emit('updateStatus', serverMatch.status);
          this.loop();
        });
      }, 200);
    }
  }

  @SubscribeMessage('updateConnections')
  handleUpdateConnections(@ConnectedSocket() client: Socket): void {
    if (
      serverMatch.leftPlayer !== undefined &&
      serverMatch.rightPlayer !== undefined
    ) {
      this.server.to(client.id).emit('updateConnections', serverMatch);
    }
  }

  @SubscribeMessage('updateSpeed')
  handleUpdateSpeed(
    @ConnectedSocket() client: Socket,
    @MessageBody() difficultyTitle: string,
  ): void {
    switch (difficultyTitle) {
      case 'Easy':
        serverMatch.speed = 400;
        break;
      case 'Medium':
        serverMatch.speed = 600;
        break;
      case 'Hard':
        serverMatch.speed = 800;
        break;
      default:
        return;
    }
    this.server.emit('updateSpeed', difficultyTitle);
  }
}
