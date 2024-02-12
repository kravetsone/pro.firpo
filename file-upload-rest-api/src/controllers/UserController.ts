import { randomBytes } from "node:crypto";
import { User, db } from "db";

const repository = db.getRepository(User);

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserController {
	static register(data: Omit<User, "token">) {
		const user = repository.create({
			...data,
			token: randomBytes(5).toString("hex"),
		});

		return repository.save(user);
	}

	static login(options: Pick<User, "email" | "password">) {
		return repository.findOneBy(options);
	}

	static loginByToken(token: string) {
		return repository.findOneBy({
			token,
		});
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
