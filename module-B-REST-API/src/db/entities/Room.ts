import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Client, Hotel } from ".";

@Entity()
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	desc_data: string;

	@OneToMany(
		() => Client,
		(client) => client.room,
	)
	clients: Client[];

	@ManyToOne(
		() => Hotel,
		(hotel) => hotel.rooms,
	)
	hotel: Hotel;
}
