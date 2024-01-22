import { Router } from "express";
import { UsersController } from "../controllers";
import { authRoutes } from "./auth";
import { clientsRoutes } from "./clients";
import { roomsRoutes } from "./rooms";

export const routes = Router();

routes.use(authRoutes);
routes.use(async (req, res, next) => {
	const authorization = req.header("authorization");
	if (!authorization?.startsWith("Bearer "))
		return res.status(401).json({
			error: {
				message: "Unauthorized",
			},
		});

	const token = authorization.slice(7);

	const user = await UsersController.signInByToken(token);
	if (!user)
		return res.status(401).json({
			error: {
				message: "Unauthorized",
			},
		});

	//@ts-ignore ts-node bug
	req.user = user;

	next();
});

routes.use(roomsRoutes);
routes.use(clientsRoutes);
