import { randomBytes } from "crypto";
import { User, db } from "../db";
import { APIError } from "../helpers";

const repository = db.getRepository(User);

export class UsersController {
	static async signUp(login: string, password: string) {
		if (
			await repository.existsBy({
				login,
			})
		)
			//TODO: throw validation error
			throw new APIError("Username must be unique", 400);

		const user = new User();

		user.login = login;
		user.password = password;
		user.token = randomBytes(18).toString("hex");

		return repository.save(user);
	}
	static async signIn(login: string, password: string) {
		return repository.findOneBy({
			login,
			password,
		});
	}

	static async signInByToken(token: string) {
		return repository.findOneBy({
			token,
		});
	}
}
