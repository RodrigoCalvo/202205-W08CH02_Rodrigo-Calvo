import { RobotController } from './robot.controller';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/user.model.js');

describe('Given a instantiated controller UserController', () => {
    let req: Partial<Request>;
    let resp: Partial<Response>;
    let next: NextFunction = jest.fn();
    let mockPopulate = jest.fn();
    let mockModel = {
        find: jest.fn().mockReturnValue({ populate: mockPopulate }),
        findOne: jest.fn(),
        findById: jest.fn().mockReturnValue({ populate: mockPopulate }),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };
    let controller = new RobotController(
        mockModel as unknown as mongoose.Model<{}>
    );
    bcryptjs.compare = jest.fn();
    jwt.sign = jest.fn();
    User.findById = jest.fn();
    beforeEach(() => {
        req = {
            params: { id: '62b5d4943bc55ff0124f6c1d' },
        };
        resp = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
    });
    describe('When method getAllController is called and it success', () => {
        test('Then in success resp.send should be called with the data', async () => {
            const mockResult = [{ test: 'test' }];
            (mockPopulate as jest.Mock).mockResolvedValue(mockResult);
            await controller.getAllController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('Then in not success function "next" should be called with the error', async () => {
            (mockPopulate as jest.Mock).mockResolvedValue(null);
            next = jest.fn();
            await controller.getAllController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
    describe('When method getController is called', () => {
        test('Then with a ok response resp.send should be called with data', async () => {
            const mockResult = { test: 'test' };
            (mockPopulate as jest.Mock).mockResolvedValue(mockResult);
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('Then with a not ok response next should be called with an error', async () => {
            const mockResult = null;
            (mockPopulate as jest.Mock).mockResolvedValue(mockResult);
            next = jest.fn();
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(ReferenceError));
        });
        test('Then with a not ok id next should be called with an error', async () => {
            req = {
                params: { id: '943bc55ff0124f6c1d' },
            };
            next = jest.fn();
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(URIError));
        });
    });
    describe('When method postController is called', () => {
        test('Then if not error resp.send should be called with data', async () => {
            const mockResult = {
                robot: '62b5d4943bc55ff0124f6c1d',
                save: jest.fn(),
            };
            req = { body: { user: '62b5d4943bc55ff0124f6c1d' } };
            (User.findById as jest.Mock).mockResolvedValue(mockResult);
            (mockModel.create as jest.Mock).mockResolvedValue(mockResult);
            await controller.postController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('Then if error function next should be called', async () => {
            const mockResult = null;
            req = { body: { user: '62b5d4943bc55ff0124f6cd' } };
            (mockModel.create as jest.Mock).mockRejectedValue(mockResult);
            next = jest.fn();
            await controller.postController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
        test('Then if error function next should be called', async () => {
            const mockResult = null;
            req = {
                body: { user: '62b5d4943bc55ff0124f6cd3' },
                params: { id: '62b5d4943bc55ff0124f6c1d' },
            };
            (mockModel.create as jest.Mock).mockRejectedValue(mockResult);
            (User.findById as jest.Mock).mockResolvedValue(mockResult);
            next = jest.fn();
            await controller.postController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
