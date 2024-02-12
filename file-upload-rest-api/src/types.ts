import { User } from "db";

declare module "express-serve-static-core" {
	interface Request {
		user: User;
	}
}
