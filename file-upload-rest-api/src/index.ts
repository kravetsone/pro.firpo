import cors from "cors";
import Express, { NextFunction, Request, Response } from "express";
import "./db";
import { APIError } from "./errors";

const express = Express();

express.use(Express.json());
express.use(cors());

express.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof APIError)
		return res.status(err.code).json({
			message: err.message,
		});
});

express.listen(3213, () => console.log("started"));
