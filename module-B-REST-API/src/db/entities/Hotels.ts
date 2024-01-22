import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    name: string;

    @Column({
        unique: true
    })
    number: number;
}