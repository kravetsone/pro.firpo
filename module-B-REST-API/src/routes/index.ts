import {Router} from "express";
import {authRoutes} from "./auth";
import {Users} from "../controllers";

export const routes = Router();

routes.use(authRoutes)
routes.use(async (req, res, next) => {
    const authorization = req.header("authorization")
    if (!authorization?.startsWith("Bearer ")) return res.status(401).json({
        error: {
            message: "Unauthorized"
        }
    });

    const token = authorization.slice(7);

    const user = await Users.signInByToken(token);
    if (!user) return res.status(401).json({
        error: {
            message: "Unauthorized"
        }
    });

    //@ts-expect-error why ts-node not see global types declaration....
    req.user = user

    next()
});