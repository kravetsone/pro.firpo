import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    login: string;

    @Column()
    password: string

    @Column({
        unique: true
    })
    token: string
}

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    desc_data: string;
}

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

    @Column()
    id_childdata: number;
}