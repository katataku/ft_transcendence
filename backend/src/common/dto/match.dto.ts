import { IsNumber } from 'class-validator';

export class MatchDto {
  @IsNumber()
  id: number;
  @IsNumber()
  p1: number;
  @IsNumber()
  p2: number;
  @IsNumber()
  winner: number;
}

export class MatchResultDto {
  @IsNumber()
  id: number;
  @IsNumber()
  winner: number;
}
