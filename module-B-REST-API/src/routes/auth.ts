import {Router} from "express";
import {validate} from "../helpers";
import {UsersController} from "../controllers";

export const authRoutes = Router()

authRoutes.post("/signup", validate({
    username: "string",
    password: "string"
}), async (req, res) => {
    try {
        await UsersController.signUp(req.body.username, req.body.password)

        return res.json({
            data: {
                message: "Administrator created"
            }
        });
    } catch (e) {
        if(e instanceof Error) return res.status(400).json({
            error: {
                message: e.message
            }
        })
    }
})

authRoutes.post("/login", validate({
    username: "string",
    password: "string"
}), async (req, res) => {
    const user = await UsersController.signIn(req.body.username, req.body.password);
    if(!user) return res.status(401).send({
        message: "Unauthorized",
        errors: {
            login: "invalid credentials"
        }
    });

    return res.json({
        data: {
            token_user: user.token
        }
    });
})