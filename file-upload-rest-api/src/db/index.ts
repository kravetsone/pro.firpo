import { DataSource } from "typeorm";

export const db = new DataSource({
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: "root",
	password: "root",
	database: "file-api",
	synchronize: true,
	logging: true,
	entities: [],
});

db.initialize().then(() => console.log("[DATABASE] connected!"));
