import { db, User } from "../db";
import {randomBytes} from "crypto";

const repository = db.getRepository(User)

export class Users {
    static async signUp(login: string, password: string) {
        if(await repository.existsBy({
            login
        })) throw new Error("Username exists");

        const user = new User()

        user.login = login;
        user.password = password;
        user.token = randomBytes(18).toString("hex")

        return repository.save(user)
    }
    static async signIn(login: string, password: string) {
        return repository.findOneBy({
            login,
            password
        });
    }

    static async signInByToken(token: string) {
       return repository.findOneBy({
            token
        });
    }
}