import { UserController } from "controllers";
import { User } from "db";
import { APIError } from "errors";
import { FindOptionsRelations } from "typeorm";
import { asyncHandler } from "./asyncHandler";

export const auth = (relations: FindOptionsRelations<User> = {}) =>
	asyncHandler(async (req, res, next) => {
		const authorization = req.header("authorization");
		if (!authorization?.startsWith("Bearer "))
			throw new APIError(401, "No login");

		const token = authorization.slice(7);

		const user = await UserController.loginByToken(token, relations);
		if (!user) throw new APIError(401, "No login");

		req.user = user;

		next();
	});
