import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { User } from '../models/user.model.js';
import { Controller } from './controller.js';

export class RobotController<T> extends Controller<T> {
    constructor(public model: Model<T>) {
        super(model);
    }
    getAllController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            req;
            const result = await this.model
                .find()
                .populate('user', { robot: 0 });
            if (!result) throw new Error('Not data');
            resp.setHeader('Content-type', 'application/json');
            resp.send(JSON.stringify(result));
        } catch (error) {
            next(error);
        }
    };
    getController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            if (req.params.id.length !== 24)
                throw new URIError('-ID length not valid');
            const result = await this.model
                .findById(req.params.id)
                .populate('user', { robot: 0 });
            if (result) {
                resp.setHeader('Content-type', 'application/json');
                resp.send(JSON.stringify(result));
            } else {
                throw new ReferenceError('Item not found');
            }
        } catch (error) {
            next(error);
        }
    };
    postController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            if (req.body.user.length !== 24) {
                throw new URIError('ID length not valid');
            }
            const user = await User.findById(req.body.user);
            if (!user) throw new ReferenceError('User not found'); // obligar los robots tengan usuario (lo quiero??)
            const newRobot = await this.model.create(req.body);
            user.robot = newRobot.id;
            user.save();
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newRobot));
        } catch (error) {
            next(error);
        }
    };
}
