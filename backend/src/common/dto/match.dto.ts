import { IsNumber, IsString } from 'class-validator';

export class MatchDto {
  @IsNumber()
  id: number;
  @IsNumber()
  p1: number;
  @IsNumber()
  p2: number;
  @IsString()
  pu_speed: string;
  @IsString()
  pu_paddle: string;
  @IsString()
  pu_end_score: string;
  @IsNumber()
  winner: number;
}

export class MatchResultDto {
  @IsNumber()
  id: number;
  @IsNumber()
  winner: number;
}
