import { randomBytes } from "node:crypto";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { FileController } from "../controllers";
import { File } from "../db";
import { asyncHandler, auth } from "../helpers";
import { validate } from "../helpers";

const allowedFileExtensions = [
	"doc",
	"pdf",
	"docx",
	"zip",
	"jpeg",
	"jpg",
	"png",
];

const storage = multer.diskStorage({
	destination: `${process.cwd()}/files`,
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);

		cb(null, randomBytes(5).toString("hex") + ext);
	},
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		console.log(file);
		if (!req.failedFiles) req.failedFiles = [];

		const ext = path.extname(file.originalname).slice(1);
		const filename = file.originalname.replace(ext, "");

		// wrong extension and 2mb file-size limit
		if (!allowedFileExtensions.includes(ext) || file.size > 2 * 1024 * 1024) {
			console.log(ext, filename, file);
			req.failedFiles.push(filename);
			return cb(null, false);
		}

		return cb(null, true);
	},
});

export const fileRouter = Router();

function getFileName(original: string, files: File[]) {
	let index = 1;
	let filename = original;

	while (files.find((x) => x.name === filename)) {
		const ext = path.extname(filename);

		filename = original.replace(ext, `(${index})${ext}`);
		index++;
	}

	return filename;
}

fileRouter.post(
	"/files",
	auth({
		files: true,
	}),
	upload.array("files[]"),
	asyncHandler(async (req, res) => {
		if (!Array.isArray(req.files)) throw new Error("Please provide files");

		const files = req.failedFiles
			.map((filename) => ({
				success: false,
				message: "File not loaded",
				name: filename,
			}))
			.concat(
				req.files.map((file) => {
					const ext = path.extname(file.originalname);
					const fileId = file.filename.replace(ext, "");
					const name = getFileName(file.originalname, req.user.files);

					return {
						success: true,
						message: "Success",
						name: name,
						url: `http://localhost:3213/files/${fileId}`,
						file_id: fileId,
					};
				}),
			) as {
			success: boolean;
			message: string;
			name: string;
			url?: string;
			file_id?: string;
		}[];
		console.log(req.headers);
		await FileController.add(
			req.user,
			files
				.filter((x) => x.success)
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				.map((file) => ({ name: file.name, file_id: file.file_id! })),
		);

		return res.json(files);
	}),
);

fileRouter.get(
	"/files/disk",
	auth({
		files: {
			accesses: true,
		},
	}),
	asyncHandler(async (req, res) => {
		console.log(req.user.files);

		return res.json(
			req.user.files.map((file) => ({
				name: file.name,
				file_id: file.file_id,
				url: `http://localhost:3213/files/${file.file_id}`,
				accesses: [
					{
						fullname: `${req.user.first_name} ${req.user.last_name}`,
						email: req.user.email,
						type: "author",
					},
				].concat(
					file.accesses.map((x) => ({
						fullname: `${x.first_name} ${x.last_name}`,
						email: x.email,
						type: "co-author",
					})),
				),
			})),
		);
	}),
);
fileRouter.get(
	"/files/shared",
	auth(),
	asyncHandler(async (req, res) => {
		const shared = await FileController.shared(req.user);

		return res.json(
			shared.map((file) => ({
				name: file.name,
				file_id: file.file_id,
				url: `http://localhost:3213/files/${file.file_id}`,
			})),
		);
	}),
);

fileRouter.patch(
	"/files/:fileId",
	auth(),
	validate({
		name: "string",
	}),
	asyncHandler(async (req, res) => {
		await FileController.rename(req.user, req.params.fileId, req.body.name);

		return res.json({
			success: true,
			message: "Renamed",
		});
	}),
);

fileRouter.delete(
	"/files/:fileId",
	auth(),
	asyncHandler(async (req, res) => {
		await FileController.remove(req.user, req.params.fileId);

		return res.json({
			success: true,
			message: "File already deleted",
		});
	}),
);

fileRouter.get(
	"/files/:fileId",
	auth(),
	asyncHandler(async (req, res) => {
		const { file_id, name } = await FileController.get(
			req.user,
			req.params.fileId,
		);

		return res.sendFile(
			`${process.cwd()}/files/${file_id}${path.extname(name)}`,
		);
	}),
);

fileRouter.post(
	"/files/:fileId/accesses",
	auth(),
	validate({
		email: "string",
	}),
	asyncHandler(async (req, res) => {
		const { accesses, owner } = await FileController.addAccess(
			req.user,
			req.params.fileId,
			req.body.email,
		);

		return res.json(
			[
				{
					fullname: `${owner.first_name} ${owner.last_name}`,
					email: owner.email,
					type: "author",
				},
			].concat(
				accesses.map((x) => ({
					fullname: `${x.first_name} ${x.last_name}`,
					email: x.email,
					type: "co-author",
				})),
			),
		);
	}),
);

fileRouter.delete(
	"/files/:fileId/accesses",
	auth(),
	validate({
		email: "string",
	}),
	asyncHandler(async (req, res) => {
		const { accesses, owner } = await FileController.removeAccess(
			req.user,
			req.params.fileId,
			req.body.email,
		);

		return res.json(
			[
				{
					fullname: `${owner.first_name} ${owner.last_name}`,
					email: owner.email,
					type: "author",
				},
			].concat(
				accesses.map((x) => ({
					fullname: `${x.first_name} ${x.last_name}`,
					email: x.email,
					type: "co-author",
				})),
			),
		);
	}),
);
