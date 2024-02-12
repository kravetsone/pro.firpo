import { randomBytes } from "node:crypto";
import { User, db } from "db";

const repository = db.getRepository(User);

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserController {
	static register(user: Omit<User, "token">) {
		return repository.create({
			...user,
			token: randomBytes(5).toString("hex"),
		});
	}

	static auth(options: Pick<User, "email" | "password">) {
		return repository.findOneBy(options);
	}

	static async logout(token: string) {
		const user = await repository.findOneBy({
			token,
		});
		if (!user) return null;

		user.token = randomBytes(5).toString("hex");

		repository.save(user);
	}
}
