import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserController } from './user.controller';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

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
    let controller = new UserController(
        mockModel as unknown as mongoose.Model<{}>
    );
    bcryptjs.compare = jest.fn();
    jwt.sign = jest.fn();
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
    describe('When method loginController is called with a valid user', () => {
        test('Then resp.send should be called with the token and id', async () => {
            const mockResult = { id: 'test' };
            const mockedToken = 'test';
            (mockModel.findOne as jest.Mock).mockResolvedValue(mockResult);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockResolvedValue(mockedToken);
            req = { body: { name: 'test' } };
            await controller.loginController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method loginController is called with a non valid user', () => {
        test('Then next should be called with an Error', async () => {
            const mockResult = { id: 'test' };
            const mockedToken = 'test';
            (mockModel.findOne as jest.Mock).mockResolvedValue(mockResult);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(false);
            (jwt.sign as jest.Mock).mockResolvedValue(mockedToken);
            req = { body: { name: 'test' } };
            await controller.loginController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
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
            const mockResult = { test: 'test' };
            req = { body: { pwd: 'test' } };
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
            req = { body: { pwd: 'test' } };
            (mockModel.create as jest.Mock).mockRejectedValue(mockResult);
            next = jest.fn();
            await controller.postController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalledWith(null);
        });
    });
    describe('When method patchController is called', () => {
        test('Then with a not ok id next should be called with an error', async () => {
            req = {
                params: { id: '943bc55ff0124f6c1d' },
            };
            next = jest.fn();
            await controller.patchController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(URIError));
        });
        test('Then with a non existent id, next should be called with an error', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                body: { life: 8 },
            };
            const mockResult = null;
            (mockModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
                mockResult
            );
            next = jest.fn();
            await controller.patchController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(ReferenceError));
        });
        test('Then with all valid data, res.send should be called with the data', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                body: { test: 'newtest' },
            };
            const mockResult = { test: 'test' };
            (mockModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
                mockResult
            );
            next = jest.fn();
            await controller.patchController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
    });
    describe('When method deleteController is called', () => {
        test('Then with a not ok id next should be called with an error', async () => {
            req = {
                params: { id: '943bc55ff0124f6c1d' },
            };
            next = jest.fn();
            await controller.deleteController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(URIError));
        });
        test('Then on success result res.send should be called with empty object', async () => {
            const mockResult = true;
            (mockModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
                mockResult
            );
            await controller.deleteController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify({}));
        });
        test('Then on not success result next should be called with an error', async () => {
            const mockResult = false;
            (mockModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
                mockResult
            );
            next = jest.fn();
            await controller.deleteController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(expect.any(ReferenceError));
        });
    });
});
