import { EStatus, IBall, IMatch, IPaddle, IPlayer } from './types/game.model';
import { deepCopy } from './utility';

const settings = {
  winWid: 1000,
  winHght: 500,
  ballPx: 20,
  winScore: 3,
  paddleSize: {
    x: 8,
    y: 100,
  },
};

export const SpeedOpts = { Easy: 'Slow', Medium: 'Medium', Hard: 'Fast' };
export const PaddleOpts = { Easy: 'Long', Medium: 'Short', Hard: 'Tiny' };

function getRandomNumberInRange(): number {
  return Math.random() - 0.5;
}

export function initBall(velX = -1): IBall {
  return {
    pos: {
      x: settings.winWid / 2 - settings.ballPx / 2,
      y: settings.winHght / 2 - settings.ballPx / 2,
    },
    vel: { x: velX, y: getRandomNumberInRange() },
  };
}

export const initLeftPaddle: IPaddle = {
  pos: {
    x: settings.winWid / 20,
    y: settings.winHght / 2 - settings.paddleSize.y / 2,
  },
  id: 'left',
};

export const initRightPaddle: IPaddle = {
  pos: {
    x: settings.winWid - (settings.winWid / 20 + settings.paddleSize.x),
    y: settings.winHght / 2 - settings.paddleSize.y / 2,
  },
  id: 'right',
};

export const initLeftProfile: IPlayer = {
  id: 1,
  socketID: '',
  name: 'Player1',
  matchHistory: { wins: 0, losses: 0 },
  ready: false,
  paddle: deepCopy(initLeftPaddle),
  score: 0,
};

export const initRightProfile: IPlayer = {
  id: 2,
  socketID: '',
  name: 'Player2',
  matchHistory: { wins: 0, losses: 0 },
  ready: false,
  paddle: deepCopy(initRightPaddle),
  score: 0,
};

export const initServerMatch: IMatch = {
  id: 0,
  leftPlayer: undefined,
  rightPlayer: undefined,
  ball: initBall(),
  speed: 300,
  status: EStatus.none,
  lastFrameTime: Date.now(),
  elapsedTime: 0,
  settings: settings,
};
