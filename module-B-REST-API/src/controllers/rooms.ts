import {db, Room} from "../db";

const repository = db.getRepository(Room);

export class Rooms {
    static async create(name: string, dec_data: string) {
        const room = new Room();

        room.name = name;
        room.desc_data = dec_data;

        return repository.save(room);
    }

    static async list(){
        return repository.find()
    }

    static async delete(id: number) {
        if(!await repository.existsBy({
            id
        })) throw new Error("Not found");

        return repository.delete(id);
    }
}