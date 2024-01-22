import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne } from "typeorm";
import { Client } from ".";
import { Hotel } from "./Hotels";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    desc_data: string;

    @OneToMany(() => Client, (client) => client.room)
    clients: Client[]

    @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
    hotel: Hotel
}