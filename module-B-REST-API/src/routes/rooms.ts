import {Router} from "express";
import {validate} from "../helpers";
import {Rooms} from "../controllers/rooms";

export const roomsRoutes = Router();

roomsRoutes.post("/room",
    validate({
        name: "string",
        desc_data: "string"
    }), async (req, res) => {
    await Rooms.create(req.body.name, req.body.desc_data);

    return res.json({
        data: {
            message: "Created"
        }
    })
});

roomsRoutes.get("/rooms", async (req, res) => {
    const rooms = await Rooms.list();

    return res.json({
        list: rooms
    })
});

roomsRoutes.delete("/room/:id", async (req, res) => {
    if(Number.isNaN(req.params.id)) return res.json({
        "message": "The given data was invalid.",
        "errors": {
            "id": ["The id in path params must be a number"]
        }
    });

    try {
        await Rooms.delete(+req.params.id)

        return res.json({
                "data": {
                    "message": "Deleted"
                }
            }
        );
    } catch (e) {
        if(e instanceof Error)  return res.status(403).json({
                error: {
                    message: e.message
                }
            }
        )
    }
})