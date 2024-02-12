import { ValidationError } from "errors";
import { asyncHandler } from "./asyncHandler";

export type Types = "string" | "email" | "password";

// TODO: Maybe add field key automatically??
export function validate(schemas: Record<string, Types>) {
	return asyncHandler((req, res, next) => {
		const errorsKeys: Record<string, string[]> = {};

		const keys = Object.keys(schemas);

		for (const key of keys) {
			const errors: string[] = [];
			const schema = schemas[key];
			const value = req.body[key];

			if (!value) errors.push(`field ${key} can not be blank`);

			if (schema === "string" && typeof value !== "string")
				errors.push(`field ${key} not string`);
			// [INFO] не забывать про эксейп .
			if (schema === "email" && !/(.+)@(.+)\.(.+)/gi.test(schema))
				errors.push(`field ${key} not email`);

			if (schema === "password") {
				if (!/[a-z]/.test(value))
					errors.push(`field ${key} must contain lowercase letters`);
				if (!/[A-Z]/.test(value))
					errors.push(`field ${key} must contain uppercase letters`);
				if (!/\d/.test(value)) errors.push(`field ${key} must contain numbers`);
				if (value.length < 3)
					errors.push(`field ${key} length must be great than 2`);
			}

			if (errors.length) errorsKeys[key] = errors;
		}

		if (!Object.keys(errorsKeys).length) return next();

		throw new ValidationError(errorsKeys);
	});
}
