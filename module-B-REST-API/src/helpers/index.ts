import {NextFunction, Request, Response} from "express";

type ValidTypes = "boolean" | "string" | "number";

export function validate(schema: Record<string, ValidTypes>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const error: {message: string, errors: Record<string, string[]>} = {
            "message": "The given data was invalid.",
            "errors": {}
        }

        const keys = Object.keys(schema);

        keys.forEach(x => {
            const errors: string[] = [];

            if(!req.body[x]) errors.push(`The ${x} field is required.`);
            if(typeof req.body[x] !== schema[x]) errors.push(`The ${x} field must be ${schema[x]} type.`);

            if(errors.length) error.errors[x] = errors;
        });

        if(!Object.keys(error.errors).length) return next();

        return res.status(400).json(error);
    }
}