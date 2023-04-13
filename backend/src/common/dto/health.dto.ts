import { IsString } from 'class-validator';

export class HealthDto {
  @IsString()
  health: string;
}
