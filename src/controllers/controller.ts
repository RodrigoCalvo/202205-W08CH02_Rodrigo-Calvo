import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export class Controller<T> {
    constructor(public model: mongoose.Model<T>) {}

    getAllController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            req;
            const result = await this.model.find();
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
            const result = await this.model.findById(req.params.id);
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
            const result = await this.model.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(result));
        } catch (error) {
            next(error);
        }
    };
    patchController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            if (req.params.id.length !== 24) {
                throw new URIError('ID length not valid');
            }
            const result = await this.model.findByIdAndUpdate(
                req.params.id,
                req.body
            );
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
    deleteController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            if (req.params.id.length !== 24)
                throw new URIError('ID length not valid');
            const success = await this.model.findByIdAndDelete(req.params.id);
            if (success) {
                resp.status(202);
                resp.send(JSON.stringify({}));
            } else {
                throw new ReferenceError('Item not found');
            }
        } catch (error) {
            next(error);
        }
    };
}
