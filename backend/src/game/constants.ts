import {
  EStatus,
  IBall,
  IMatch,
  IPaddle,
  IPlayer,
  Vector2,
} from './types/game.model';
import { deepCopy } from './utility';

export const gameWinWid = 1000;
export const gameWinHght = 500;
export const ballPx = 20;
export const winningScore = 3;

export const paddleSize: Vector2 = {
  x: 8,
  y: 100,
};

export const initBall: IBall = {
  pos: { x: gameWinWid / 2 - ballPx / 2, y: gameWinHght / 2 - ballPx / 2 },
  vel: { x: -1, y: 0.5 },
};

export const initLeftPaddle: IPaddle = {
  pos: { x: gameWinWid / 20, y: gameWinHght / 2 - paddleSize.y / 2 },
  id: 'left',
};

export const initRightPaddle: IPaddle = {
  pos: {
    x: gameWinWid - (gameWinWid / 20 + paddleSize.x),
    y: gameWinHght / 2 - paddleSize.y / 2,
  },
  id: 'right',
};

export const initLeftProfile: IPlayer = {
  id: 1,
  socketID: '',
  name: 'Player1',
  wins: 3,
  losses: 7,
  ready: false,
  paddle: deepCopy(initLeftPaddle),
  score: 0,
};

export const initRightProfile: IPlayer = {
  id: 2,
  socketID: '',
  name: 'Player2',
  wins: 13,
  losses: 17,
  ready: false,
  paddle: deepCopy(initRightPaddle),
  score: 0,
};

export const initServerMatch: IMatch = {
  id: 0,
  leftPlayer: undefined,
  rightPlayer: undefined,
  ball: deepCopy(initBall),
  speed: 400,
  status: EStatus.none,
  lastFrameTime: Date.now(),
  elapsedTime: 0,
};
