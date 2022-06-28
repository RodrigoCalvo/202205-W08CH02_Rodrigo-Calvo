import { Router } from 'express';
import { RobotController } from '../controllers/robot.controller.js';
import { Robot } from '../models/robot.model.js';
import { loginRequired } from '../middlewares/login-required.js';
import { userRequiredForRobots } from '../middlewares/user-required-robot.js';

export const robotsRouter = Router();

export const robotsController = new RobotController(Robot);

robotsRouter.get('/', loginRequired, robotsController.getAllController);
robotsRouter.get('/:id', robotsController.getController);
robotsRouter.post('/', loginRequired, robotsController.postController);
// robotsRouter.patch(
//     '/:idRobot/d/:idUser',
//     robotsController.patchDeleteUserController
// );
// robotsRouter.patch(
//     '/:idRobot/:idUser',
//     robotsController.patchAddUserController
// );
robotsRouter.patch(
    '/:id',
    loginRequired,
    userRequiredForRobots,
    robotsController.patchController
);
robotsRouter.delete(
    '/:id',
    loginRequired,
    userRequiredForRobots,
    robotsController.deleteController
);
