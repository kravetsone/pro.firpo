import { Router } from "express";
import { ClientsController, RoomsController } from "../controllers";
import { validate } from "../helpers";

export const clientsRoutes = Router();

clientsRoutes.post(
	"/register",
	validate({
		fio: { type: "string" },
		email: { type: "string" },
		phone: { type: "string" },
		id_childdata: { type: "number" },
		birth_date: { type: "string" },
	}),
	(req) => ClientsController.getUniqueValidation(req.body),
	async (req, res) => {
		await ClientsController.create(req.body);

		return res.status(201).json({
			data: {
				message: "Created",
			},
		});
	},
);

clientsRoutes.patch(
	"/userdata/:id",
	validate({
		fio: { type: "string", optional: true },
		email: { type: "string", optional: true },
		phone: { type: "string", optional: true },
		id_childdata: { type: "number", optional: true },
		birth_date: { type: "string", optional: true },
	}),
	async (req, res) => {
		await ClientsController.update(+req.params.id, req.body);

		return res.json({
			data: {
				id: req.params.id,
				message: "Updated",
			},
		});
	},
);

clientsRoutes.delete("/userdata/:id", async (req, res) => {
	await ClientsController.delete(+req.params.id);

	return res.status(204).json({
		data: {
			message: "Deleted",
		},
	});
});

clientsRoutes.get("/room/:roomId/userdata/:userId", async (req, res) => {
	await ClientsController.changeRoom(+req.params.userId, +req.params.roomId);

	return res.json({
		data: {
			message: "Changed",
		},
	});
});

clientsRoutes.get("/usersinroom", async (req, res) => {
	const list = await RoomsController.listWithClients();

	return res.json({
		data: list.map((room) => ({
			name: room.name,
			userdata: room.clients.map((client) => ({
				fio: client.fio,
				phonenumber: client.phone,
			})),
		})),
	});
});
