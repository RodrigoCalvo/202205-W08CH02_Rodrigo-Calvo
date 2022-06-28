import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

import { User } from '../models/user.model.js';

export const usersRouter = Router();

export const usersController = new UserController(User);

usersRouter.get('/', usersController.getAllController);
usersRouter.get('/:id', usersController.getController);
usersRouter.post('/', usersController.postController);
usersRouter.post('/login', usersController.loginController);
// usersRouter.patch(
//     '/:idUser/d/:idRobot',
//     usersController.patchDeleteRobotController
// );
// usersRouter.patch('/:idUser/:idRobot', usersController.patchAddRobotController);
usersRouter.patch('/:id', usersController.patchController);
usersRouter.delete('/:id', usersController.deleteController);
