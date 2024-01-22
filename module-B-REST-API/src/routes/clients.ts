import {Router} from "express";
import {validate} from "../helpers";
import {ClientsController} from "../controllers";

export const clientsRoutes = Router();

clientsRoutes.post("/register", validate({
    fio: {type: "string"},
    email: {type: "string"},
    phone: {type: "string"},
    id_childdata: {type: "number"},
    birth_date: {type: "string"}
}), async (req, res) => {
    const uniqueValidation = await ClientsController.getUniqueValidation(req.body);
    if(uniqueValidation) return res.status(400).json(uniqueValidation);

    try {
        await ClientsController.create(req.body)

        return res.json({
                data: {
                    message: "Created"
                }
        })
    } catch (e) {
        if(e instanceof Error) return res.status(400).json({
            error: {
                message: e.message
            }
        })
    }
})

clientsRoutes.patch("/userdata/:id", validate({
    fio: {type: "string", optional: true},
    email: {type: "string", optional: true},
    phone: {type: "string", optional: true},
    id_childdata: {type: "number", optional: true},
    birth_date: {type: "string", optional: true}
}), async (req, res) => {
    try {
        await ClientsController.update(+req.params.id, req.body)

        return res.json({
            data: {
                id: req.params.id,
                message: "Updated"
            }
        })
    } catch (e) {
        if(e instanceof Error) return res.status(400).json({
            error: {
                message: e.message
            }
        })
    }
});

clientsRoutes.delete("/userdata/:id", async (req, res) => {
    try {
        await ClientsController.delete(+req.params.id);

        return {
            data: {
                message: "Deleted"
            }
        }
    } catch (e) {
        if(e instanceof Error) return res.status(400).json({
            error: {
                message: e.message
            }
        })
    }
})

clientsRoutes.get("/room/:roomId/userdata/:userId", async (req, res) => {
    try {
    await ClientsController.changeRoom(+req.params.userId, +req.params.roomId)
    
    return res.json({
        data: {
            message: "Changed"
        }
       }) 
    } catch (e) {
        if(e instanceof Error) return res.status(400).json({
            error: {
                message: e.message
            }
        })
    }
})