import { NextFunction, Request, Response } from "express";
import { ValidationError } from "./ValidationError";
import { asyncHandler } from "./asyncHandler";

type ValidTypes = "boolean" | "string" | "number";
interface Validation {
	type: ValidTypes;
	optional?: boolean;
	isNotNan?: boolean;
}

export function validate(
	schemas: Record<string, Validation>,
	source: keyof Request = "body",
) {
	return asyncHandler((req: Request, res: Response, next: NextFunction) => {
		const keysErrors: Record<string, string[]> = {};

		const keys = Object.keys(schemas);

		for (const x of keys) {
			const errors: string[] = [];
			const value = req[source][x];
			const schema = schemas[x];

			if (!value && !schema.optional)
				errors.push(`The ${x} field is required.`);

			if (value && typeof value !== schema.type)
				errors.push(`The ${x} field must be ${schema.type} type.`);

			if (schema.isNotNan && Number.isNaN(+value))
				errors.push(`The ${x} field from path params can't parse to number!`);

			if (errors.length) keysErrors[x] = errors;
		}

		if (!Object.keys(keysErrors).length) return next();

		throw new ValidationError(keysErrors);
	});
}
