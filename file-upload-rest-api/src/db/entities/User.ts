import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//!NOTE - "strictPropertyInitialization": false, in tsconfig
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column()
	token: string;
}
