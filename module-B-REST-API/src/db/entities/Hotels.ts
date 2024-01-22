import {
	Column,
	Entity,
	JoinTable,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./Room";

@Entity()
export class Hotel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	name: string;

	@Column({
		unique: true,
	})
	number: number;

	@OneToMany(
		() => Room,
		(room) => room.hotel,
	)
	@JoinTable()
	rooms: Room[];
}
