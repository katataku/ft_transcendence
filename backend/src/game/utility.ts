import { Vector2 } from './types/game.model';

export const deepCopy = (obj: object): any => {
  return JSON.parse(JSON.stringify(obj));
};

export function decideSpeed(
  difficulty: string,
  opts: { Easy: string; Medium: string; Hard: string },
): number {
  switch (difficulty) {
    case opts.Easy:
      return 400;
    case opts.Medium:
      return 600;
    case opts.Hard:
      return 800;
    default:
      return 400;
  }
}

export function decidePaddleSize(
  difficulty: string,
  opts: { Easy: string; Medium: string; Hard: string },
): Vector2 {
  switch (difficulty) {
    case opts.Easy:
      return { x: 8, y: 100 };
    case opts.Medium:
      return { x: 8, y: 70 };
    case opts.Hard:
      return { x: 8, y: 40 };
    default:
      return { x: 8, y: 100 };
  }
}
