import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'match' })
export class Match {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'p1' })
  p1!: number;

  @Column({ name: 'p2' })
  p2!: number;

  @Column({ name: 'pu_speed' })
  pu_speed!: string;

  @Column({ name: 'pu_paddle' })
  pu_paddle!: string;

  @Column({ name: 'pu_end_score' })
  pu_end_score!: string;

  @Column({ name: 'winner' })
  winner!: number;
}
