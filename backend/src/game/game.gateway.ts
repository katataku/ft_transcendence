import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { IBall, IPaddle, UPlayer, Vector2 } from './dto/game.dto';

const gameWinWid = 1000;
const gameWinHght = 600;
const ballPx = 20;
// const winningScore = 3;

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
  ready: false,
};

const initRightPaddle: IPaddle = {
  pos: {
    x: gameWinWid - (gameWinWid / 20 + paddleSize.x),
    y: gameWinHght / 2 - paddleSize.y / 2,
  },
  id: 'right',
  score: 0,
  ready: false,
};

const deepCpInitBall = (): IBall => {
  return JSON.parse(JSON.stringify(initBall)); // deep copy of Object
};

let serverBall: IBall = undefined;

let leftPlayerId: string;
let rightPlayerId: string;

const playerPaddle: Map<string, IPaddle> = new Map<string, IPaddle>();
// const playerPaddle: { [clientId: string]: IPaddle } = {};

// websocketGateway

@WebSocketGateway(3002, { namespace: 'game', cors: { origin: '*' } })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  intervalId: NodeJS.Timeout;

  calculateTilt(relativePosBall: number): number {
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

  handlePaddleCollision(ball: IBall, paddle: IPaddle): void {
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

  isHitPaddle(ball: IBall, paddle: IPaddle): boolean {
    return (
      paddle.pos.x <= ball.pos.x + ballPx &&
      ball.pos.x <= paddle.pos.x + paddleSize.x &&
      paddle.pos.y <= ball.pos.y + ballPx &&
      ball.pos.y <= paddle.pos.y + paddleSize.y
    );
  }

  updateBall(
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
      if (ball.vel.x < 0) {
        rightPaddle.score++;
      } else {
        leftPaddle.score++;
      }
      ball.pos = deepCpInitBall().pos;
      ball.vel = deepCpInitBall().vel;
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

  private logger: Logger = new Logger('GameGateway');

  afterInit(_server: Server) {
    //初期化
    this.logger.log('初期化しました。');
  }

  handleConnection(client: Socket, ..._args: any[]) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
    if (playerPaddle.size === 0) {
      console.log('first player joined');
      //creating player 1
      playerPaddle.set(client.id, initLeftPaddle);
      leftPlayerId = client.id;
    } else if (playerPaddle.size === 1) {
      console.log('second player joined');
      //creating player 2
      playerPaddle.set(client.id, initRightPaddle);
      rightPlayerId = client.id;
      console.log(playerPaddle);
      this.server.emit('updatePaddle', Object.fromEntries(playerPaddle));
      serverBall = deepCpInitBall();

      let lastFrameTime = Date.now();
      this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastFrameTime) / 1000;
        // console.log(deltaTime);
        lastFrameTime = currentTime;
        // ゲームの状態を更新する処理
        serverBall = this.updateBall(
          serverBall,
          deltaTime,
          400,
          playerPaddle.get(leftPlayerId),
          playerPaddle.get(rightPlayerId),
        );

        // クライアントにデータを送信する
        this.server.emit('updateBall', serverBall);
        this.server.emit('updatePaddle', Object.fromEntries(playerPaddle));
      }, 1000 / 60);
    } else if (playerPaddle.size > 1) {
      console.log('too many players, bye');
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    clearInterval(this.intervalId);
  }

  @SubscribeMessage('serverUpdatePaddle')
  handleUpdatePaddle(
    @MessageBody() data: { newPaddle: IPaddle; isReady: boolean },
  ): void {
    // console.log(`serverUpdatePaddle data.isReady: ${data.isReady}`);
    data.newPaddle.ready = data.isReady;
    if (data.newPaddle.id === 'left')
      playerPaddle.set(leftPlayerId, data.newPaddle);
    else playerPaddle.set(rightPlayerId, data.newPaddle);
  }

  @SubscribeMessage('updatePlayerReady')
  handleUpdatePlayerReady(@MessageBody() playerID: UPlayer): void {
    if (playerID === 'left') {
      playerPaddle.get(leftPlayerId).ready = true;
      this.server.emit('updateOtherPlayerButton', 'left');
    } else {
      playerPaddle.get(rightPlayerId).ready = true;
      this.server.emit('updateOtherPlayerButton', 'right');
    }
    if (
      playerPaddle.get(leftPlayerId).ready &&
      playerPaddle.get(rightPlayerId).ready
    )
      console.log('game ready!');
  }

  //   @SubscribeMessage('matchSet')
  //   matchSet(): void {
  //     clearInterval(this.intervalId);
  //   }

  @SubscribeMessage('giveMeInfo')
  newClient(@ConnectedSocket() client: Socket): void {
    if (leftPlayerId !== undefined && rightPlayerId !== undefined) {
      console.log("socket.on('newClient')");
      console.log(playerPaddle.get(leftPlayerId).ready ? 'L true' : 'L false');
      console.log(
        playerPaddle.get(rightPlayerId).ready ? 'Right true' : 'Right false',
      );

      this.server
        .to(client.id)
        .emit('updateReady', playerPaddle.get(leftPlayerId).ready, 'left');
      this.server
        .to(client.id)
        .emit('updateReady', playerPaddle.get(rightPlayerId).ready, 'right');
    }
  }
}
