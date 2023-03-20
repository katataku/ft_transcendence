import { EStatus, IMatch, IPaddle, IScore } from './types/game.model';
import { initBall } from './constants';

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

function handlePaddleCollision(match: IMatch, paddle: IPaddle): void {
  const compositeVelocity = Math.sqrt(
    match.ball.vel.x ** 2 + match.ball.vel.y ** 2,
  );
  match.ball.vel.y = calculateTilt(
    // ボールがパドルの何%で衝突したのか)
    (match.ball.pos.y +
      match.settings.ballPx / 2 -
      (paddle.pos.y + match.settings.paddleSize.y / 2)) /
      (match.settings.paddleSize.y / 2),
  );
  match.ball.vel.x =
    match.ball.vel.x < 0
      ? Math.sqrt(compositeVelocity ** 2 - match.ball.vel.y ** 2)
      : -Math.sqrt(compositeVelocity ** 2 - match.ball.vel.y ** 2);
}

function isHitPaddle(match: IMatch, paddle: IPaddle): boolean {
  return (
    paddle.pos.x <= match.ball.pos.x + match.settings.ballPx &&
    match.ball.pos.x <= paddle.pos.x + match.settings.paddleSize.x &&
    paddle.pos.y <= match.ball.pos.y + match.settings.ballPx &&
    match.ball.pos.y <= paddle.pos.y + match.settings.paddleSize.y
  );
}

function isHitWall(match: IMatch): boolean {
  return (
    (match.ball.pos.y <= 0 && match.ball.vel.y < 0) ||
    (match.ball.pos.y >= match.settings.winHght - match.settings.ballPx &&
      match.ball.vel.y > 0)
  );
}

function isHitGoal(match: IMatch): boolean {
  return (
    match.ball.pos.x <= 0 ||
    match.ball.pos.x >= match.settings.winWid - match.settings.ballPx
  );
}

export function updateMatch(
  match: IMatch,
  deltaTime: number,
  goalCallback: (id: string, score: IScore, status: EStatus) => void,
): void {
  match.ball.pos.x += match.ball.vel.x * deltaTime * match.speed;
  match.ball.pos.y += match.ball.vel.y * deltaTime * match.speed;

  if (isHitWall(match)) {
    match.ball.vel.y *= -1;
  } else if (isHitGoal(match)) {
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
    match.ball = initBall(match.ball.vel.x < 0 ? 1 : -1);
  } else if (
    match.ball.vel.x < 0 &&
    isHitPaddle(match, match.leftPlayer.paddle)
  ) {
    handlePaddleCollision(match, match.leftPlayer.paddle);
  } else if (
    match.ball.vel.x > 0 &&
    isHitPaddle(match, match.rightPlayer.paddle)
  ) {
    handlePaddleCollision(match, match.rightPlayer.paddle);
  }
}

export function isMatchSet(match: IMatch): boolean {
  return (
    match.leftPlayer.score >= match.settings.winScore ||
    match.rightPlayer.score >= match.settings.winScore
  );
}
