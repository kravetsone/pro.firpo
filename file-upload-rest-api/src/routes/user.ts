import { Router } from "express";
import { UserController } from "../controllers";
import { asyncHandler, auth, validate } from "../helpers";

export const userRouter = Router();

userRouter.post(
	"/registration",
	validate({
		email: "email",
		password: "password",
		first_name: "string",
		last_name: "string",
	}),
	asyncHandler(async (req, res) => {
		const { token } = await UserController.register(req.body);

		return res.json({
			success: true,
			message: "Success",
			token,
		});
	}),
);

userRouter.post(
	"/authorization",
	validate({
		email: "email",
		password: "password",
	}),
	asyncHandler(async (req, res) => {
		const user = await UserController.login(req.body);
		if (!user)
			return res.status(401).json({
				success: false,
				message: "Login failed",
			});

		return res.json({
			success: true,
			message: "Success",
			token: user.token,
		});
	}),
);

userRouter.get(
	"/logout",
	auth(),
	asyncHandler(async (req, res) => {
		await UserController.logout(req.user);

		return res.json({
			success: true,
			message: "Logout",
		});
	}),
);
