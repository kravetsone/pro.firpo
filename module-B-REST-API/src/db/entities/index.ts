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