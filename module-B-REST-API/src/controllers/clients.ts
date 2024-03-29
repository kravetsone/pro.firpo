import { Client, Room, db } from "../db";
import { APIError, ValidationError } from "../helpers";
import { RoomsController } from "./rooms";

const repository = db.getRepository(Client);

type ClientData = Pick<Client, "fio" | "email" | "birth_date" | "phone"> & {
	id_childdata: number;
	room?: Room;
};

export class ClientsController {
	static async getUniqueValidation(client: ClientData) {
		const nonUnique = await repository.findBy([
			{
				fio: client.fio,
			},
			{ email: client.email },
			{ phone: client.phone },
		]);

		if (!nonUnique.length) return null;

		const errors: Record<string, string[]> = {};

		if (nonUnique.find((x) => x.fio === client.fio))
			errors.fio = ["The fio must be unique"];
		if (nonUnique.find((x) => x.email === client.email))
			errors.email = ["The email must be unique"];
		if (nonUnique.find((x) => x.phone === client.phone))
			errors.phone = ["The phone must be unique"];

		throw new ValidationError(errors);
	}

	static async create(data: ClientData) {
		await ClientsController.getUniqueValidation(data);

		const room = await RoomsController.find(data.id_childdata);

		if (!room) throw new APIError("Not found", 403);

		const client = new Client();

		client.email = data.email;
		client.fio = data.fio;
		client.birth_date = data.birth_date;
		client.phone = data.phone;
		client.room = room;

		return repository.save(client);
	}

	static async update(id: number, data: ClientData) {
		if (data.id_childdata) {
			const room = await RoomsController.find(data.id_childdata);
			if (!room) throw new APIError("Not found", 403);

			data.room = room;
		}

		return repository.update(id, data);
	}

	static async delete(id: number) {
		const client = await repository.findOneBy({
			id,
		});
		if (!client) throw new APIError("Not found", 403);

		return repository.delete(id);
	}

	static async changeRoom(clientId: number, roomId: number) {
		const client = await repository.findOneBy({
			id: clientId,
		});
		if (!client) throw new APIError("Not found", 403);

		const room = await RoomsController.find(roomId);
		if (!room) throw new APIError("Not found", 403);

		client.room = room;

		return repository.save(client);
	}
}
