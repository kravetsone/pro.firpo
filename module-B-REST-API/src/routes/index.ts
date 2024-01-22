import { Router } from "express";
import { UsersController } from "../controllers";
import { APIError } from "../helpers";
import { authRoutes } from "./auth";
import { clientsRoutes } from "./clients";
import { hotelsRoutes } from "./hotels";
import { roomsRoutes } from "./rooms";

export const routes = Router();

routes.use(authRoutes);
routes.use(async (req, res, next) => {
	const authorization = req.header("authorization");
	if (!authorization?.startsWith("Bearer "))
		throw new APIError("Unauthorized", 401);

	const token = authorization.slice(7);

	const user = await UsersController.signInByToken(token);
	if (!user) throw new APIError("Unauthorized", 401);

	//@ts-ignore ts-node bug
	req.user = user;

	next();
});

routes.use(roomsRoutes);
routes.use(clientsRoutes);
routes.use(hotelsRoutes);
