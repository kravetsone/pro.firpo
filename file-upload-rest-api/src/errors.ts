export class APIError extends Error {
	code: number;

	constructor(code: number, message: string) {
		super();
		this.message = message;
		this.code = code;
	}
}
