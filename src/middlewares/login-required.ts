import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ExtRequest } from '../interfaces/interfaces';
dotenv.config();

export const loginRequired = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authorization = req.get('authorization');
    const tokenError = new Error('Token missing or invalid');
    tokenError.name = 'TokenError';
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        const token = authorization.substring(7); // quitar el bearer
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );
        if (typeof decodedToken === 'string') {
            next(tokenError);
        } else {
            (req as ExtRequest).tokenPayload = decodedToken;
            next();
        }
    } else {
        next(tokenError);
    }
};
