import { NextFunction, Request, Response } from "express";
import { ValidationError } from "./ValidationError";
import { asyncHandler } from "./asyncHandler";

type ValidTypes = "boolean" | "string" | "number";
interface Validation {
	type: ValidTypes;
	optional?: boolean;
}

export function validate(schema: Record<string, Validation>) {
	return asyncHandler((req: Request, res: Response, next: NextFunction) => {
		const errors: Record<string, string[]> = {};

		const keys = Object.keys(schema);

		for (const x of keys) {
			const errors: string[] = [];

			if (!req.body[x] && !schema[x].optional)
				errors.push(`The ${x} field is required.`);

			if (req.body[x] && typeof req.body[x] !== schema[x].type)
				errors.push(`The ${x} field must be ${schema[x]} type.`);
		}

		if (!Object.keys(errors).length) return next();

		throw new ValidationError(errors);
	});
}
