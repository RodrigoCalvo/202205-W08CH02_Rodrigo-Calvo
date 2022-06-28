import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { Controller } from './controller.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
dotenv.config();

export class UserController<T> extends Controller<T> {
    constructor(public model: Model<T>) {
        super(model);
    }
    loginController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            const findUser: any = await this.model.findOne({
                name: String(req.body.name),
            });
            if (
                !findUser ||
                !(await bcryptjs.compare(req.body.pwd, findUser.pwd))
            ) {
                const error = new Error('User or password invalid');
                error.name = 'AuthorizationError';
                throw error;
            } else {
                const token = jwt.sign(
                    {
                        id: findUser.id,
                        name: findUser.name,
                    },
                    process.env.JWT_SECRET as string
                );
                resp.setHeader('Content-type', 'application/json');
                resp.status(201);
                //La id la añadimos porque nos da la gana
                resp.send(JSON.stringify({ token, id: findUser.id }));
            }
        } catch (error) {
            next(error);
        }
    };
    getAllController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            req;
            const result = await this.model
                .find()
                .populate('robot', { user: 0 });
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
                throw new URIError('ID length not valid');
            const result = await this.model
                .findById(req.params.id)
                .populate('robot', { user: 0 });
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
            req.body.pwd = await bcryptjs.hash(req.body.pwd, 10);
            const result = await this.model.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(result));
        } catch (error) {
            console.log(error);

            next(error);
        }
    };
}
