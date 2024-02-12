import { DataSource } from "typeorm";
import { File, User } from "./entities";

export * from "./entities";

export const db = new DataSource({
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: "root",
	password: "root",
	database: "file-api",
	synchronize: true,
	logging: true,
	entities: [User, File],
});

db.initialize().then(() => console.log("[DATABASE] connected!"));
