import fs from "node:fs/promises";
import path from "node:path";
import { File, User, db } from "../db";
import { APIError, ValidationError } from "../errors";

const repository = db.getRepository(File);
const userRepository = db.getRepository(User);

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class FileController {
	// need files relation
	static async add(user: User, files: { name: string; file_id: string }[]) {
		return await Promise.all(
			files.map(
				async (x) =>
					await repository.save(
						repository.create({
							file_id: x.file_id,
							name: x.name,
							owner: user,
							accesses: [],
						}),
					),
			),
		);
	}

	static async rename(user: User, fileId: string, name: string) {
		const file = await repository.findOneBy({
			file_id: fileId,
		});
		if (!file) throw new APIError(404, "Not found");
		if (file.owner.id !== user.id) throw new APIError(402, "Forbidden for you");

		const isFileNameExists = await repository.findOneBy({
			name,
			owner: user,
		});
		if (isFileNameExists)
			throw new ValidationError({
				name: ["Field name must be unique!"],
			});

		file.name = name;

		return repository.save(file);
	}

	static async remove(user: User, fileId: string) {
		const file = await repository.findOne({
			where: { file_id: fileId },
			relations: {
				owner: true,
			},
		});

		if (!file) throw new APIError(404, "Not found");
		if (file.owner.id !== user.id) throw new APIError(402, "Forbidden for you");

		await fs.rm(
			`${process.cwd()}/files/${file.file_id}${path.extname(file.name)}`,
		);

		return repository.delete(file.file_id);
	}

	static async get(user: User, fileId: string) {
		const file = await repository.findOne({
			where: { file_id: fileId },
			relations: {
				accesses: true,
				owner: true,
			},
		});
		console.log(user, file);
		if (!file) throw new APIError(404, "Not found");
		if (
			file.owner.id !== user.id &&
			!file.accesses.find((x) => x.id === user.id)
		)
			throw new APIError(402, "Forbidden for you");

		return file;
	}

	static async addAccess(user: User, fileId: string, email: string) {
		const file = await repository.findOne({
			where: { file_id: fileId },
			relations: {
				accesses: true,
			},
		});
		if (!file) throw new APIError(404, "File not found");
		if (file.owner.id !== user.id) throw new APIError(402, "Forbidden for you");

		const otherUser = await userRepository.findOneBy({
			email,
		});
		if (!otherUser) throw new APIError(404, "User not found");

		file.accesses.push(otherUser);

		return repository.save(file);
	}

	static async removeAccess(user: User, fileId: string, email: string) {
		if (user.email === email) throw new APIError(400, "Тайлера здесь нет.");

		const file = await repository.findOne({
			where: { file_id: fileId },
			relations: {
				accesses: true,
			},
		});
		if (!file) throw new APIError(404, "File not found");
		if (file.owner.id !== user.id) throw new APIError(402, "Forbidden for you");

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

	static async disk(user: User) {
		return repository.find({
			where: { owner: user },
			relations: {
				accesses: true,
			},
		});
	}

	static async shared(user: User) {
		return repository.find({
			where: { accesses: user },
			relations: {
				accesses: true,
			},
		});
	}
}
