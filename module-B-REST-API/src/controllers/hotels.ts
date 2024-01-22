import { db } from "../db";
import { Hotel } from "../db/entities/Hotels";
import { APIError } from "../helpers";
import { RoomsController } from "./rooms";

const repository = db.getRepository(Hotel);

export class HotelsController {
	static async validateUnique(data: Hotel) {
		const nonUnique = await repository.findBy([
			{ name: data.name },
			{ number: data.number },
		]);

		if (!nonUnique.length) return null;

		const errors: Record<string, string[]> = {};

		if (nonUnique.find((x) => x.name === data.name))
			errors.name = ["The name must be unique"];
		if (nonUnique.find((x) => x.number === data.number))
			errors.number = ["The number must be unique"];

		return {
			message: "The given data was invalid.",
			errors: errors,
		};
	}

	static async create(data: Hotel) {
		const hotel = new Hotel();

		hotel.name = data.name;
		hotel.number = data.number;

		return repository.save(hotel);
	}

	static async list() {
		return repository.find({
			select: {
				name: true,
				number: true,
			},
		});
	}

	static async delete(id: number) {
		const client = await repository.findOneBy({
			id,
		});
		if (!client) throw new APIError("Not found", 403);

		return repository.delete(id);
	}

	static async setRoom(roomId: number, hotelId: number) {
		const hotel = await repository.findOne({
			where: { id: hotelId },
			relations: {
				rooms: true,
			},
		});
		if (!hotel) throw new APIError("Not found", 403);

		const room = await RoomsController.find(roomId);
		if (!room) throw new APIError("Not found", 403);

		hotel.rooms.push(room);

		return [hotel, room];
	}

	static async listWithRooms() {
		return repository.find({
			relations: {
				rooms: {
					clients: true,
				},
			},
		});
	}
}
