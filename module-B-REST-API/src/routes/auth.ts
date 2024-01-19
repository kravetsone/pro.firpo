import {Router} from "express";
import {validate} from "../helpers";

export const authRoutes = Router()

authRoutes.post("/signup", validate({
    username: "string",
    password: "string"
}), (req, res) => {

    res.json(1)
})