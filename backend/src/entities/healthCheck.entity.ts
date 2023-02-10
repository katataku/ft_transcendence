import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'health' })
export class HealthCheck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'health' })
  health!: string;
}
