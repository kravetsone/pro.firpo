import "reflect-metadata"
import Express from "express";
import "./db";
import cors from "cors";

const app = Express();

app.use(cors())

app.listen(3001, "::", () => console.log("[SERVER] started"));