import { Vector2 } from './types/game.model';
import { PaddleOpts, SpeedOpts, EndScoreOpts } from './constants';

export const deepCopy = (obj: object): any => {
  return JSON.parse(JSON.stringify(obj));
};

export function decideSpeed(difficulty: string): number {
  const opts = SpeedOpts;

  switch (difficulty) {
    case opts.Easy:
      return 300;
    case opts.Medium:
      return 500;
    case opts.Hard:
      return 700;
    default:
      return 300;
  }
}

export function decidePaddleSize(difficulty: string): Vector2 {
  const opts = PaddleOpts;

  switch (difficulty) {
    case opts.Easy:
      return { x: 8, y: 120 };
    case opts.Medium:
      return { x: 8, y: 80 };
    case opts.Hard:
      return { x: 8, y: 40 };
    default:
      return { x: 8, y: 120 };
  }
}

export function decideEndScore(difficulty: string): number {
  const opts = EndScoreOpts;

  switch (difficulty) {
    case opts.Easy:
      return 3;
    case opts.Medium:
      return 7;
    case opts.Hard:
      return 10;
    default:
      return 3;
  }
}
