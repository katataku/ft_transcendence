import {
  EStatus,
  IBall,
  IMatch,
  IMatchSettings,
  IPaddle,
  IPlayer,
  UPlayer,
} from './types/game.model';

export const PowerUP = {
  Speed: 'Speed',
  Paddle: 'Paddle',
  Score: 'Score',
};

export const SpeedOpts = {
  Easy: { desc: 'Speed-Slow', value: 300 },
  Medium: { desc: 'Speed-Medium', value: 500 },
  Hard: { desc: 'Speed-Fast', value: 700 },
};

export const PaddleOpts = {
  Easy: { desc: 'Paddle-Large', value: { x: 8, y: 120 } },
  Medium: { desc: 'Paddle-Medium', value: { x: 8, y: 80 } },
  Hard: { desc: 'Paddle-Small', value: { x: 8, y: 40 } },
};

export const EndScoreOpts = {
  Easy: { desc: 'End Score-3', value: 3 },
  Medium: { desc: 'End Score-7', value: 7 },
  Hard: { desc: 'End Score-10', value: 10 },
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
            y: settings.winHght / 2 - settings.paddleSize.value.y / 2,
          }
        : {
            x:
              settings.winWid -
              (settings.winWid / 20 + settings.paddleSize.value.x),
            y: settings.winHght / 2 - settings.paddleSize.value.y / 2,
          },
    id: player,
  };
}

const initSettings = {
  winWid: 1000,
  winHght: 500,
  ballPx: 20,
  paddleSpeed: 10,
  winScore: { desc: PowerUP.Score, value: EndScoreOpts.Easy.value },
  paddleSize: { desc: PowerUP.Paddle, value: PaddleOpts.Easy.value },
  ballSpeed: { desc: PowerUP.Speed, value: SpeedOpts.Easy.value },
};

export const initLeftProfile: IPlayer = {
  id: 1,
  socketID: '',
  name: 'Player1',
  matchHistory: { wins: 0, losses: 0 },
  ready: false,
  paddle: initPaddle(initSettings, 'left'),
  score: 0,
};

export const initRightProfile: IPlayer = {
  id: 2,
  socketID: '',
  name: 'Player2',
  matchHistory: { wins: 0, losses: 0 },
  ready: false,
  paddle: initPaddle(initSettings, 'right'),
  score: 0,
};

export const initServerMatch: IMatch = {
  id: 0,
  leftPlayer: undefined,
  rightPlayer: undefined,
  ball: initBall(initSettings),
  status: EStatus.none,
  lastFrameTime: Date.now(),
  elapsedTime: 0,
  settings: initSettings,
};
