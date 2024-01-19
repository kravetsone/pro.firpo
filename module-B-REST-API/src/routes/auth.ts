import {Router} from "express";
import {validate} from "../helpers";
import {Users} from "../controllers";

export const authRoutes = Router()

authRoutes.post("/signup", validate({
    username: "string",
    password: "string"
}), async (req, res) => {
    try {
        await Users.signUp(req.body.username, req.body.password)

        return res.json({
            data: {
                message: "Administrator created"
            }
        });
    } catch (e) {
        res.status(400).json({
            error: {
                message: "Username must be unique"
            }
        })
    }
})