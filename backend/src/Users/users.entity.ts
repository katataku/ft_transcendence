import { create } from "domain";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Users {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@CreateDateColumn({name: 'created_at'})
	createdAt!: Date
}