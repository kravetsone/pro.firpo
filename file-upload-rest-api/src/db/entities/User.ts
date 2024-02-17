import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { File } from "./File";

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

	@OneToMany(
		() => File,
		(file) => file.owner,
	)
	files: File[];

	@ManyToMany(
		() => File,
		(user) => user.accesses,
	)
	@JoinTable()
	accesses: File[];
}
