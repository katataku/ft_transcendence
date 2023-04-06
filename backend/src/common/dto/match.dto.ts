import { IsNotEmpty, IsNumber } from 'class-validator';

export class MatchDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsNumber()
  p1: number;
  @IsNotEmpty()
  @IsNumber()
  p2: number;
  @IsNotEmpty()
  @IsNumber()
  winner: number;
}

export class MatchResultDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsNumber()
  winner: number;
}
