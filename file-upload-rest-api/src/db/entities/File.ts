import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class File {
	@PrimaryColumn()
	file_id: string;

	@Column({ unique: true })
	name: string;

	@ManyToOne(
		() => User,
		(user) => user.files,
	)
	owner: User;

	@ManyToMany(
		() => User,
		(user) => user.accesses,
	)
	accesses: User[];
}
