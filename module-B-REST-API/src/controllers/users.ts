import { db, User } from "../db";

const repository = db.getRepository(User)
export class Users {
    signUp(login: string, password: string) {
        const user = new User()

        user.login = login;
        user.password = password;

        return repository.save(user)
    }
}