import { Room, db } from "../db";
import { APIError } from "../helpers";

const repository = db.getRepository(Room);

export class RoomsController {
	static async create(name: string, dec_data: string) {
		const room = new Room();

		room.name = name;
		room.desc_data = dec_data;

		return repository.save(room);
	}

	static async list() {
		return repository.find();
	}

	static async delete(id: number) {
		if (
			!(await repository.existsBy({
				id,
			}))
		)
			throw new APIError("Not found", 403);

		return repository.delete(id);
	}

	static async find(id: number) {
		return repository.findOneBy({
			id,
		});
	}

	static async listWithClients() {
		return repository.find({
			relations: {
				clients: true,
			},
		});
	}
}
