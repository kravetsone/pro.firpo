import "reflect-metadata"
import Express from "express";

const app = Express();

app.listen(3001, "::", () => console.log("[SERVER] started"));