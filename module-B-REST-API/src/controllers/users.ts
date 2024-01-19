import { db, User } from "../db";

const repository = db.getRepository(User)

export class Users {
    static async signUp(login: string, password: string) {
        if(await repository.existsBy({
            login
        })) throw new Error("Username exists");

        const user = new User()

        user.login = login;
        user.password = password;

        return repository.save(user)
    }
}