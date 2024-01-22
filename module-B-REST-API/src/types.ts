import { User } from "./db";

declare global {
	namespace Express {
		export interface Request {
			user: User;
		}
	}
}
