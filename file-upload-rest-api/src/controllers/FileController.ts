import { randomBytes } from "crypto";
import { File, User, db } from "db";
import { APIError, ValidationError } from "errors";

const repository = db.getRepository(File);
const userRepository = db.getRepository(User);

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class FileController {
	static async add(token: string, files: { name: string; file_id: string }[]) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
			relations: {
				files: true,
			},
		});
		if (!user) throw new APIError(401, "No login");

		user.files.push(
			...files.map((x) => {
				const file = new File();

				file.file_id = x.file_id;
				file.name = x.name;
				file.owner = user;
				file.accesses = [];

				return file;
			}),
		);

		await userRepository.save(user);
	}

	static async rename(token: string, fileId: string, name: string) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
		});
		if (!user) throw new APIError(401, "No login");

		const file = await repository.findOneBy({
			file_id: fileId,
		});
		if (!file) throw new APIError(404, "Not found");
		if (file.owner.id !== user.id) throw new APIError(405, "No access");

		const isFileNameExists = await repository.findOneBy({
			name,
			owner: user,
		});
		if (isFileNameExists)
			throw new ValidationError({
				name: ["Field name must be unique!"],
			});

		file.name = name;

		return await repository.save(file);
	}

	static async remove(token: string, fileId: string) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
		});
		if (!user) throw new APIError(401, "No login");

		const file = await repository.findOneBy({
			file_id: fileId,
		});
		if (!file) throw new APIError(404, "Not found");
		if (file.owner.id !== user.id) throw new APIError(405, "No access");

		return await repository.delete(file.file_id);
	}

	static async get(token: string, fileId: string) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
		});
		if (!user) throw new APIError(401, "No login");

		const file = await repository.findOne({
			where: { file_id: fileId },
			relations: {
				accesses: true,
			},
		});
		if (!file) throw new APIError(404, "Not found");
		if (
			file.owner.id !== user.id ||
			!file.accesses.find((x) => x.id === user.id)
		)
			throw new APIError(405, "No access");

		return file;
	}

	static async addAccess(token: string, fileId: string, email: string) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
		});
		if (!user) throw new APIError(401, "No login");

		const file = await repository.findOne({
			where: { file_id: fileId },
			relations: {
				accesses: true,
			},
		});
		if (!file) throw new APIError(404, "File not found");
		if (file.owner.id !== user.id) throw new APIError(405, "No access");

		const otherUser = await userRepository.findOneBy({
			email,
		});
		if (!otherUser) throw new APIError(404, "User not found");

		file.accesses.push(otherUser);

		return repository.save(file);
	}

	static async removeAccess(token: string, fileId: string, email: string) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
		});
		if (!user) throw new APIError(401, "No login");

		if (user.email === email) throw new APIError(400, "Тайлера здесь нет.");

		const file = await repository.findOne({
			where: { file_id: fileId },
			relations: {
				accesses: true,
			},
		});
		if (!file) throw new APIError(404, "File not found");
		if (file.owner.id !== user.id) throw new APIError(405, "No access");

		const otherUser = await userRepository.findOneBy({
			email,
		});
		if (!otherUser) throw new APIError(404, "User not found");

		const index = file.accesses.findIndex((x) => x.id === otherUser.id);
		if (index === -1)
			throw new APIError(400, "User does not have access to file");
		file.accesses.splice(index, 1);

		return repository.save(file);
	}

	static async disk(token: string) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
		});
		if (!user) throw new APIError(401, "No login");

		return repository.find({
			where: { owner: user },
			relations: {
				accesses: true,
			},
		});
	}

	static async shared(token: string) {
		const user = await userRepository.findOne({
			where: {
				token,
			},
		});
		if (!user) throw new APIError(401, "No login");

		return repository.find({
			where: { accesses: user },
			relations: {
				accesses: true,
			},
		});
	}
}
