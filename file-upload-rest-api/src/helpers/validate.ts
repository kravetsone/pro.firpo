import { ValidationError } from "errors";
import { asyncHandler } from "./asyncHandler";

export type Types = "number" | "string";

export function validate(schemas: Record<string, Types>) {
	return asyncHandler((req, res, next) => {
		const errorsKeys: Record<string, string[]> = {};

		const keys = Object.keys(schemas);

		for (const key of keys) {
			const errors: string[] = [];
			const schema = schemas[key];
			const value = req.body[key];

			if (!value) errors.push(`field ${key} can not be blank`);
			// biome-ignore lint/suspicious/useValidTypeof: <explanation>
			if (typeof value !== schema) errors.push(`field ${key} not string!`);
			if (errors.length) errorsKeys[key] = errors;
		}

		if (!Object.keys(errorsKeys).length) return next();

		throw new ValidationError(errorsKeys);
	});
}
