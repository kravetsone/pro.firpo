import { Router } from "express";
import { UsersController } from "../controllers";
import { asyncHandler, validate } from "../helpers";

export const authRoutes = Router();

authRoutes.post(
	"/signup",
	validate({
		username: { type: "string" },
		password: { type: "string" },
	}),
	asyncHandler(async (req, res) => {
		await UsersController.signUp(req.body.username, req.body.password);

		return res.json({
			data: {
				message: "Administrator created",
			},
		});
	}),
);

authRoutes.post(
	"/login",
	validate({
		username: { type: "string" },
		password: { type: "string" },
	}),
	asyncHandler(async (req, res) => {
		const user = await UsersController.signIn(
			req.body.username,
			req.body.password,
		);
		if (!user)
			return res.status(401).send({
				message: "Unauthorized",
				errors: {
					login: "invalid credentials",
				},
			});

		return res.json({
			data: {
				token_user: user.token,
			},
		});
	}),
);
