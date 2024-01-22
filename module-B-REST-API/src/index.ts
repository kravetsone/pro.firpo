import cors from "cors";
import Express from "express";
import "reflect-metadata";
import "./db";
import { routes } from "./routes";

export const app = Express();

app.use(cors());
app.use(Express.json());
app.use(routes);

//@ts-ignore Why error handler example throw TS Error? https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});
app.listen(3001, "::", () => console.log("[SERVER] started"));
