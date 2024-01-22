import { Router } from "express";
import { RoomsController } from "../controllers";
import { ValidationError, validate } from "../helpers";

export const roomsRoutes = Router();

roomsRoutes.post(
	"/room",
	validate({
		name: { type: "string" },
		desc_data: { type: "string" },
	}),
	async (req, res) => {
		await RoomsController.create(req.body.name, req.body.desc_data);

		return res.json({
			data: {
				message: "Created",
			},
		});
	},
);

roomsRoutes.get("/rooms", async (req, res) => {
	const rooms = await RoomsController.list();

	return res.json({
		list: rooms,
	});
});

roomsRoutes.delete("/room/:id", async (req, res) => {
	if (Number.isNaN(req.params.id))
		throw new ValidationError({
			id: ["The id in path params must be a number"],
		});

	await RoomsController.delete(+req.params.id);

	return res.status(204).json({
		data: {
			message: "Deleted",
		},
	});
});
