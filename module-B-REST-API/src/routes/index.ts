import {Router} from "express";
import {authRoutes} from "./auth";

export const routes = Router();

routes.use(authRoutes)