import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinTable } from "typeorm";
import { Room } from "./Room";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    fio: string;

    @Column({
        unique: true
    })
    email: string;

    @Column({
        unique: true
    })
    phone: string;

    @Column()
    birth_date: string;

    @OneToOne(() => Room, (room) => room.client)
    @JoinTable({ name: "id_childdata" })
    room: Room
}