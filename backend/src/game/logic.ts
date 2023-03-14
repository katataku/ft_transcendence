import { EStatus, IBall, IMatch, IPaddle, IScore } from './types/game.model';
import * as GameSetting from './constants';

function calculateTilt(relativePosBall: number): number {
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

function handlePaddleCollision(ball: IBall, paddle: IPaddle): void {
  const compositeVelocity = Math.sqrt(ball.vel.x ** 2 + ball.vel.y ** 2);
  ball.vel.y = calculateTilt(
    // ボールがパドルの何%で衝突したのか)
    (ball.pos.y +
      GameSetting.ballPx / 2 -
      (paddle.pos.y + GameSetting.paddleSize.y / 2)) /
      (GameSetting.paddleSize.y / 2),
  );
  ball.vel.x =
    ball.vel.x < 0
      ? Math.sqrt(compositeVelocity ** 2 - ball.vel.y ** 2)
      : -Math.sqrt(compositeVelocity ** 2 - ball.vel.y ** 2);
}

function isHitPaddle(ball: IBall, paddle: IPaddle): boolean {
  return (
    paddle.pos.x <= ball.pos.x + GameSetting.ballPx &&
    ball.pos.x <= paddle.pos.x + GameSetting.paddleSize.x &&
    paddle.pos.y <= ball.pos.y + GameSetting.ballPx &&
    ball.pos.y <= paddle.pos.y + GameSetting.paddleSize.y
  );
}

function isHitWall(ball: IBall): boolean {
  return (
    (ball.pos.y <= 0 && ball.vel.y < 0) ||
    (ball.pos.y >= GameSetting.gameWinHght - GameSetting.ballPx &&
      ball.vel.y > 0)
  );
}

function isHitGoal(ball: IBall): boolean {
  return (
    ball.pos.x <= 0 || ball.pos.x >= GameSetting.gameWinWid - GameSetting.ballPx
  );
}

export function updateMatch(
  match: IMatch,
  deltaTime: number,
  goalCallback: (id: string, score: IScore, status: EStatus) => void,
): void {
  match.ball.pos.x += match.ball.vel.x * deltaTime * match.speed;
  match.ball.pos.y += match.ball.vel.y * deltaTime * match.speed;

  if (isHitWall(match.ball)) {
    match.ball.vel.y *= -1;
  } else if (isHitGoal(match.ball)) {
    match.status = EStatus.pause;
    if (match.ball.vel.x < 0) {
      match.rightPlayer.score++;
    } else {
      match.leftPlayer.score++;
    }
    goalCallback(
      match.id.toString(),
      { left: match.leftPlayer.score, right: match.rightPlayer.score },
      match.status,
    );
    match.ball = GameSetting.initBall(match.ball.vel.x * -1);
  } else if (
    match.ball.vel.x < 0 &&
    isHitPaddle(match.ball, match.leftPlayer.paddle)
  ) {
    handlePaddleCollision(match.ball, match.leftPlayer.paddle);
  } else if (
    match.ball.vel.x > 0 &&
    isHitPaddle(match.ball, match.rightPlayer.paddle)
  ) {
    handlePaddleCollision(match.ball, match.rightPlayer.paddle);
  }
}

export function isMatchSet(leftScore: number, rightScore: number): boolean {
  return (
    leftScore >= GameSetting.winningScore ||
    rightScore >= GameSetting.winningScore
  );
}
