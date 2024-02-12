import { NextFunction, Request, Response } from "express";

export function asyncHandler(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	fn: (req: Request, res: Response, next: NextFunction) => any,
) {
	return (req: Request, res: Response, next: NextFunction) =>
		Promise.resolve(fn(req, res, next)).catch(next);
}
