import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'match' })
export class Match {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'p1' })
  p1!: number;

  @Column({ name: 'p2' })
  p2!: number;
}
