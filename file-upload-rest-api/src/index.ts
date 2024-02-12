import cors from "cors";
import Express from "express";
import "./db";

const express = Express();

express.use(Express.json());
express.use(cors());

express.listen(3213, () => console.log("started"));
