import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import { NextFunction, Request, Response } from "express"

class AuthController {

    static async register(req: Request, res: Response) {
        const { email, nickname, password } = req.body;
        if (!email || !nickname || !password) return res.status(400).json({ message: 'Incomplete data to register a new user' });

        try {
            let userExists = await UserModel.find({ email });
            if (userExists.length > 0) return res.status(400).json({ message: 'User already exists' });

            const user = new UserModel({ email, nickname, password });
            await user.save();

            res.status(201).json({ message: 'User created successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
        
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        const { nickname, password } = req.body;
        if (!nickname || !password) return res.status(400).json({ message: 'Incomplete data to login' });

        try {
            const user = await UserModel.findOne({ nickname, deleted: false });
            if (!user) return res.status(400).json({ message: 'User not found' });

            const passwordMatch = await user.comparePassword(password);
            if (!passwordMatch) return res.status(400).json({ message: 'Incorrect password' });

            const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET as jwt.Secret);

            res.status(200).json({ message: 'User logged in successfully', token });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;