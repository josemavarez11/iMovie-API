import { Router } from "express";
import UserController from "../controllers/userController";

const userRouter = Router();
const user = new UserController();

//userRouter.get('/getData', user.getData); //tested ok
userRouter.put('/update', user.update); 
userRouter.put('/updateNickname', user.updateNickname); //tested ok
userRouter.put('/updatePassword', user.updatePassword); //tested ok
userRouter.put('/updateEmail', user.updateEmail); //tested ok
userRouter.delete('/delete', user.delete); //tested ok

export default userRouter;