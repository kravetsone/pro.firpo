import { randomBytes } from "node:crypto";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { FileController } from "../controllers";
import { File } from "../db";
import { asyncHandler, auth } from "../helpers";

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
	const index = 1;
	let filename = original;

	while (files.find((x) => x.name === filename)) {
		const ext = path.extname(filename);

		filename = original.replace(ext, `(${index})${ext}`);
	}

	return filename;
}

fileRouter.post(
	"/files",
	auth({
		files: true,
	}),
	upload.array("files"),
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

		await FileController.add(
			req.user,
			files
				.filter((x) => x.success)
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				.map((file) => ({ name: file.name, file_id: file.file_id! })),
		);

		return files;
	}),
);
