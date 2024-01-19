import {Router} from "express";

export const authRoutes = Router()

authRoutes.post("/signup", (req, res) => {
    res.json(1)
})