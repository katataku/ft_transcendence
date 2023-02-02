import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HealthCheck {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	health: string
}