import {Client, db} from "../db";

const repository = db.getRepository(Client);

export class ClientsController {
    static async getUniqueValidation(client: Client) {
        const nonUnique = await repository.findBy([{
            fio: client.fio
        },
            {email: client.email},
            {phone: client.phone}
        ])

        if(!nonUnique.length) return null;

        const errors: Record<string, string[]> = {};

        if(nonUnique.find(x => x.fio === client.fio)) errors.fio = ["The fio must be unique"];
        if(nonUnique.find(x => x.email === client.email)) errors.email = ["The email must be unique"];
        if(nonUnique.find(x => x.phone === client.phone)) errors.phone = ["The phone must be unique"];

        return {
            "message": "The given data was invalid.",
            "errors": errors
        }
    }

    static async create(data: Client) {
        const client = new Client();

        client.email = data.email;
        client.fio = data.fio;
        client.birth_date = data.birth_date;
        client.phone = data.phone;
        client.id_childdata = data.id_childdata;

        return repository.save(client)
    }

    static async update(id: number, data: Client) {
        return repository.update(id, data);
    }
}