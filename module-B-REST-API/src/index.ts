import "reflect-metadata"
import Express from "express";
import "./db";
import cors from "cors";
import {routes} from "./routes";

export const app = Express();

app.use(cors())
app.use(routes)

app.listen(3001, "::", () => console.log("[SERVER] started"));