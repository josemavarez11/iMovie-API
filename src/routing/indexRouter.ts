import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import authRouter from './authRouter';
import userRouter from './userRouter';
import messageRouter from './messageRouter';
import reviewRouter from './reviewRouter';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/users', authMiddleware, userRouter);
indexRouter.use('/messages', authMiddleware, messageRouter);
indexRouter.use('/reviews', authMiddleware, reviewRouter);

export default indexRouter;