import { Router } from "express";
import AuthController from "../controllers/authController";

const authRouter = Router();

authRouter.post('/register', AuthController.register); //tested ok
authRouter.post('/login', AuthController.login); //tested ok

export default authRouter;