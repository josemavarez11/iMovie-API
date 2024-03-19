import { Router } from "express";
import UserController from "../controllers/userController";

const userRouter = Router();

userRouter.get('/getNickname', UserController.getNickname); //tested ok
userRouter.put('/updateNickname', UserController.updateNickname); //tested ok
userRouter.put('/updatePassword', UserController.updatePassword); //tested ok
userRouter.put('/updateEmail', UserController.updateEmail); //tested ok
userRouter.delete('/delete', UserController.delete); //tested ok

export default userRouter;