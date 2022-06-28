import { NextFunction, Request, Response } from 'express';
import { ExtRequest } from '../interfaces/interfaces.js';
import { Robot } from '../models/robot.model.js';

export const userRequiredForRobots = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // (req as ExtRequest).tokenPayload.id; //id del usuario
    // req.params.id; //id del robot
    const findRobot = await Robot.findById(req.params.id);
    if (findRobot?.user === (req as ExtRequest).tokenPayload.id) {
        next();
    } else {
        const error = new Error('Invalid authorization');
        error.name = 'UserAuthorizationError';
        next(error);
    }
};
