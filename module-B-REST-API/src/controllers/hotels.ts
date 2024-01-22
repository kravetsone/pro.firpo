import { db } from "../db";
import { Hotel } from "../db/entities/Hotels";

const repository = db.getRepository(Hotel)

export class HotelsController {
    static async validateUnique(data: Hotel) {
        const nonUnique = await repository.findBy([
        {name: data.name},
        {number: data.number}
        ])

        if(!nonUnique.length) return null;

        const errors: Record<string, string[]> = {};

        if(nonUnique.find(x => x.name === data.name)) errors.name = ["The name must be unique"];
        if(nonUnique.find(x => x.number === data.number)) errors.number = ["The number must be unique"];

        return {
            "message": "The given data was invalid.",
            "errors": errors
        }
    }

    static async create(data: Hotel) {
        const hotel = new Hotel();

        hotel.name = data.name;
        hotel.number = data.number;

        return repository.save(hotel);
    }
}