import { Router } from "express";
import { HotelsController } from "../controllers";
import { asyncHandler, validate } from "../helpers";

export const hotelsRoutes = Router();

hotelsRoutes.post(
	"/hotel",
	validate({
		name: {
			type: "string",
		},
		number: {
			type: "number",
		},
	}),
	asyncHandler(async (req, res) => {
		const uniqueValidation = await HotelsController.validateUnique(req.body);
		if (uniqueValidation) return res.status(400).json(uniqueValidation);

		const hotel = await HotelsController.create(req.body);

		return res.status(201).json({
			data: hotel,
		});
	}),
);

hotelsRoutes.get(
	"/hotels",
	asyncHandler(async (req, res) => {
		const list = await HotelsController.list();

		return res.json({
			data: list,
		});
	}),
);

hotelsRoutes.delete(
	"/hotel/:id",
	validate(
		{
			id: { type: "string", isNotNan: true },
		},
		"params",
	),
	asyncHandler(async (req, res) => {
		await HotelsController.delete(+req.params.id);

		return res.status(204).json({
			data: {
				message: "Deleted",
			},
		});
	}),
);

hotelsRoutes.get(
	"/hotel/:hotelId/room/:roomId",
	validate(
		{
			roomId: { type: "string", isNotNan: true },
			hotelId: { type: "string", isNotNan: true },
		},
		"params",
	),
	asyncHandler(async (req, res) => {
		const [hotel, room] = await HotelsController.setRoom(
			+req.params.roomId,
			+req.params.hotelId,
		);

		return res.status(201).json({
			data: {
				name: room.name,
				title: hotel.name,
			},
		});
	}),
);

hotelsRoutes.get(
	"/roomsinhotels",
	asyncHandler(async (req, res) => {
		const list = await HotelsController.listWithRooms();

		return res.json({
			data: list.map((hotel) => ({
				title: hotel.name,
				number: hotel.number,
				data_children: hotel.rooms.map((room) => ({
					name: room.name,
					userdata: room.clients.map((client) => ({
						fio: client.fio,
						phonenumber: client.phone,
					})),
				})),
			})),
		});
	}),
);
