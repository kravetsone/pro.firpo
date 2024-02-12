export class APIError extends Error {
	code: number;

	constructor(code: number, message: string) {
		super();
		this.message = message;
		this.code = code;
	}
}

export class ValidationError extends Error {
	errors: Record<string, string[]>;

	constructor(errors: Record<string, string[]>) {
		super();
		this.errors = errors;
	}
}
