import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import authRouter from './authRouter';
import userRouter from './userRouter';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/users', authMiddleware, userRouter);

export default indexRouter;