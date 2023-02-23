import { IsBoolean, IsNumber } from 'class-validator';

export class MatchDto {
  @IsNumber()
  id: number;
  @IsNumber()
  p1: number;
  @IsNumber()
  p2: number;
  @IsNumber()
  winner: number;
  @IsBoolean()
  powerup: boolean;
}
