import { Router } from "express";
import { validate } from "../helpers";
import { HotelsController } from "../controllers/hotels";

export const hotelsRoutes = Router();

hotelsRoutes.post("/hotel", validate({
    name: {
        type: "string"
    },
    number: {
        type: "number"
    }
}), async (req, res) => {
    const uniqueValidation = await HotelsController.validateUnique(req.body);
    if(uniqueValidation) return res.status(400).json(uniqueValidation);

    const hotel = await HotelsController.create(req.body);

    return res.json({
        data: hotel
    })
})