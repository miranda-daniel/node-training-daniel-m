import { Router } from 'express';
import { getAllUsers } from '../controllers/users.controller';

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
