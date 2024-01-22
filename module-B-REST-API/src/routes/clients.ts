import {Router} from "express";
import {validate} from "../helpers";
import {ClientsController} from "../controllers";

export const clientsRoutes = Router();

clientsRoutes.post("/register", validate({
    fio: {type: "string"},
    email: {type: "string"},
    phone: {type: "string"},
    id_childdata: {type: "string"},
    birth_date: {type: "string"}
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

clientsRoutes.post("/userdata/:id", async (req, res) => {
    
    await ClientsController.update(+req.params.id, req.body)
});