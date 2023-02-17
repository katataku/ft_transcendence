import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'health' })
export class HealthCheck {
  @PrimaryColumn({ name: 'health' })
  health!: string;
}
