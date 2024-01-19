import {Router} from "express";
import {validate} from "../helpers";
import {Clients} from "../controllers/clients";

export const clientsRoutes = Router();

clientsRoutes.post("/register", validate({
    fio: "string",
    email: "string",
    phone: "string",
    id_childdata: "string",
    birth_date: "string"
}), async (req, res) => {
    const uniqueValidation = await Clients.getUniqueValidation(req.body);
    if(uniqueValidation) return res.status(400).json(uniqueValidation);

    await Clients.create(req.body)

    return res.json({
            data: {
                message: "Created"
            }
    })

})