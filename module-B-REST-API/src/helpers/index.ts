import {NextFunction, Request, Response} from "express";

type ValidTypes = "boolean" | "string" | "number";
interface Validation {
    type: ValidTypes;
    optional?: boolean
}


export function validate(schema: Record<string, Validation>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const error: {message: string, errors: Record<string, string[]>} = {
            "message": "The given data was invalid.",
            "errors": {}
        }

        const keys = Object.keys(schema);

        keys.forEach(x => {
            const errors: string[] = [];

            if(!req.body[x] && !schema[x].optional) errors.push(`The ${x} field is required.`);
            if(req.body[x] && typeof req.body[x] !== schema[x].type) errors.push(`The ${x} field must be ${schema[x]} type.`);

            if(errors.length) error.errors[x] = errors;
        });

        if(!Object.keys(error.errors).length) return next();

        return res.status(400).json(error);
    }
}