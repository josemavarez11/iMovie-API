import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';
import message from '../json/messages.json';
import UserModel from '../models/userModel';
import UserController from "./userController";

class AuthController {

    async register(req: Request, res: Response) {
        const { email, nickname, password } = req.body;
        if (!email || !nickname || !password) return res.status(400).json({ message: message.error.MissingFields });

        try {
            let userExists = await UserModel.find({ email });
            if (userExists.length > 0) return res.status(400).json({ message: message.error.ExistingUser });

            const user = new UserModel({ email, nickname, password });
            await user.save();

            res.status(201).json({ message: message.success.UserCreated });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
        
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { nickname, password } = req.body;
        if (!nickname || !password) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const user = await UserModel.findOne({ nickname, deleted: false });
            if (!user) return res.status(400).json({ message: message.error.InvalidCredentials });

            const passwordMatch = await user.comparePassword(password);
            if (!passwordMatch) return res.status(400).json({ message: message.error.InvalidCredentials });

            const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET as jwt.Secret);

            const userController = new UserController();
            const userData = await userController.getData(nickname);

            res.status(200).json({ message: message.success.LoginOk, token, userData });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;