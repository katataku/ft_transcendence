import { UserMatchHistoryDto } from '../../common/dto/users.dto';
import { Socket } from 'socket.io';

export interface Vector2 {
  x: number;
  y: number;
}

export interface IBall {
  pos: Vector2;
  vel: Vector2;
}

export interface IPaddle {
  id: UPlayer;
  pos: Vector2;
}

export interface IScore {
  left: number;
  right: number;
}

export type UPlayer = 'left' | 'right';

export interface IPlayer {
  id: number;
  socketID: string;
  name: string;
  matchHistory: UserMatchHistoryDto;
  ready: boolean;
  score: number;
  paddle: IPaddle;
}

export enum EStatus {
  none = 0,
  ready = 1,
  play = 2,
  pause = 3,
  set = 4,
}

export interface IMatchSettings {
  winWid: number;
  winHght: number;
  ballPx: number;
  paddleSpeed: number;
  endScore: { desc: string; value: number };
  paddleSize: { desc: string; value: Vector2 };
  ballSpeed: { desc: string; value: number };
}

export interface IMatch {
  id: number;
  leftPlayer: IPlayer;
  rightPlayer: IPlayer;
  ball: IBall;
  status: EStatus;
  lastFrameTime: number;
  elapsedTime: number;
  settings: IMatchSettings;
}

export interface IUserQueue {
  clientId: string;
  userId: number;
  userName: string;
}

export interface IClient {
  socket: Socket;
  userName: string;
}
