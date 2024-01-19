import { DataSource } from "typeorm";
import {Room, User} from "./entities";

export * from "./entities"

export const db = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [User, Room]
});

db.initialize().then(() => console.log("[DB] Connected!"));