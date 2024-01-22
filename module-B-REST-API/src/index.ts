import cors from "cors";
import Express from "express";
import "reflect-metadata";
import "./db";
import { APIError, ValidationError } from "./helpers";
import { routes } from "./routes";

export const app = Express();

app.use(cors());
app.use(Express.json());
app.use(routes);

//@ts-ignore Why error handler example throw TS Error? https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
app.use((err, req, res, next) => {
	if (err instanceof APIError) {
		return res.status(err.status).json({
			error: {
				message: err.message,
			},
		});
	}
	if (err instanceof ValidationError) {
		return res.status(400).json({
			message: "The given data was invalid.",
			errors: err.errors,
		});
	}
});
app.listen(3001, "::", () => console.log("[SERVER] started"));
