import { Router } from "express";
import AuthController from "../controllers/authController";

const authRouter = Router();
const auth = new AuthController();

authRouter.post('/register', auth.register); //tested ok
authRouter.post('/login', auth.login); //tested ok

export default authRouter;