import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Client } from ".";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    desc_data: string;

    @OneToOne(() => Client, (client) => client.room)
    client: Client
}