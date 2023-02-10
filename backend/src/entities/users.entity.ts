import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({database: 'users'})
export class User {
	@PrimaryGeneratedColumn({name: 'id'})
	id!: number;

	@Column({name: 'name'})
	name!: string;

	@Column({name: 'password'})
	password!: string;

	@CreateDateColumn({name: 'created_at'})
	createdAt!: Date
}