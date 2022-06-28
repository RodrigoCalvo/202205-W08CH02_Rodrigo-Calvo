import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ExtRequest extends Request {
    tokenPayload: JwtPayload;
}
