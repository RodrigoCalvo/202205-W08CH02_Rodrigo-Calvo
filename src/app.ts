import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { robotsRouter } from './routers/robot.router.ts.js';
import { usersRouter } from './routers/user.router.js';
import { errorControl } from './middlewares/error-control.js';
import { coverMenu } from './middlewares/cover-menu.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/robots', robotsRouter);
app.use('/users', usersRouter);
app.use('/', coverMenu);

app.use(errorControl);
