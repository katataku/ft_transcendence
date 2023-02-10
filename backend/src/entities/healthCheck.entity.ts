import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({database: 'health'})
export class HealthCheck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'health'})
  health!: string;
}
