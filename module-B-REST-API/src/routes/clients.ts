import {Router} from "express";
import {validate} from "../helpers";
import {ClientsController} from "../controllers";

export const clientsRoutes = Router();

clientsRoutes.post("/register", validate({
    fio: "string",
    email: "string",
    phone: "string",
    id_childdata: "string",
    birth_date: "string"
}), async (req, res) => {
    const uniqueValidation = await ClientsController.getUniqueValidation(req.body);
    if(uniqueValidation) return res.status(400).json(uniqueValidation);

    await ClientsController.create(req.body)

    return res.json({
            data: {
                message: "Created"
            }
    })

})