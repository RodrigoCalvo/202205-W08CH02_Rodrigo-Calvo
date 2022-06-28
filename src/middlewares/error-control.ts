import express, { NextFunction, Request, Response } from 'express';

const errors: any = {
    ValidationError: 406, //Not acceptable
    URIError: 400, //Bad request
    ReferenceError: 404, //Not found
    RangeError: 416, //Request range not satisfiable
    AuthorizationError: 401, //Unauthorized
    TokenError: 401, //Unauthorized
};
export function errorControl(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    req;
    next;
    const status = error.name ? errors[error.name] : 500;
    res.status(status);
    res.end(JSON.stringify({ type: error.name, message: error.message }));
}
