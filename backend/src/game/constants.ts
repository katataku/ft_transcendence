import {
  EStatus,
  IBall,
  IMatch,
  IMatchSettings,
  IPaddle,
  IPlayer,
  UPlayer,
} from './types/game.model';

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

export const SpeedOpts = {
  Easy: 'Speed-Slow',
  Medium: 'Speed-Medium',
  Hard: 'Speed-Fast',
};
export const PaddleOpts = {
  Easy: 'Paddle-Large',
  Medium: 'Paddle-Medium',
  Hard: 'Paddle-Small',
};
export const EndScoreOpts = {
  Easy: 'End Score-3',
  Medium: 'End Score-7',
  Hard: 'End Score-10',
};

export const PowerUP = {
  Speed: 'Speed',
  Paddle: 'Paddle',
  Score: 'Score',
};

function getRandomNumberInRange(): number {
  return Math.random() - 0.5;
}

export function initBall(settings: IMatchSettings, velX = -1): IBall {
  return {
    pos: {
      x: settings.winWid / 2 - settings.ballPx / 2,
      y: settings.winHght / 2 - settings.ballPx / 2,
    },
    vel: { x: velX, y: getRandomNumberInRange() },
  };
}

export function initPaddle(settings: IMatchSettings, player: UPlayer): IPaddle {
  return {
    pos:
      player === 'left'
        ? {
            x: settings.winWid / 20,
            y: settings.winHght / 2 - settings.paddleSize.y / 2,
          }
        : {
            x: settings.winWid - (settings.winWid / 20 + settings.paddleSize.x),
            y: settings.winHght / 2 - settings.paddleSize.y / 2,
          },
    id: player,
  };
}

export const initLeftProfile: IPlayer = {
  id: 1,
  socketID: '',
  name: 'Player1',
  matchHistory: { wins: 0, losses: 0 },
  ready: false,
  paddle: initPaddle(settings, 'left'),
  score: 0,
};

export const initRightProfile: IPlayer = {
  id: 2,
  socketID: '',
  name: 'Player2',
  matchHistory: { wins: 0, losses: 0 },
  ready: false,
  paddle: initPaddle(settings, 'right'),
  score: 0,
};

export const initServerMatch: IMatch = {
  id: 0,
  leftPlayer: undefined,
  rightPlayer: undefined,
  ball: initBall(settings),
  speed: 300,
  status: EStatus.none,
  lastFrameTime: Date.now(),
  elapsedTime: 0,
  settings: settings,
};
