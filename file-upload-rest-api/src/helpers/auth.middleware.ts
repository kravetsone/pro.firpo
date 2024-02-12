import { UserController } from "controllers";
import { APIError } from "errors";
import { asyncHandler } from "./asyncHandler";

export const auth = asyncHandler(async (req, res, next) => {
	const authorization = req.header("authorization");
	if (!authorization?.startsWith("Bearer "))
		throw new APIError(401, "No login");

	const token = authorization.slice(7);

	const user = await UserController.loginByToken(token);
	if (!user) throw new APIError(401, "No login");

	req.user = user;

	next();
});
