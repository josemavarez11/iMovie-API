import { NextFunction, Request, Response } from "express"
import message from '../json/messages.json';
import UserModel from "../models/userModel";

class UserController {
    async delete(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        if(!id) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: message.error.UserNotFound });

            user.deleted = true;
            await user.save();

            res.status(200).json({ message: message.success.DeleteOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateEmail(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        const { newEmail } = req.body;

        if(!id || !newEmail) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: message.error.UserNotFound });

            const emailMatch = user.compareEmail(newEmail);
            if(emailMatch) return res.status(400).json({ message: message.warning.NoChangesMade });

            user.email = newEmail;
            await user.save();

            res.status(200).json({ message: message.success.UpdateOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateNickname(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        const { newNickname } = req.body;

        if(!id || !newNickname) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: message.error.UserNotFound });

            const nicknameMatch = user.compareNickname(newNickname);
            if(nicknameMatch) return res.status(400).json({ message: message.warning.NoChangesMade });

            user.nickname = newNickname;
            await user.save();

            res.status(200).json({ message: message.success.UpdateOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        const { newPassword } = req.body;

        if(!id || !newPassword) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: message.error.UserNotFound });

            const passwordMatch = await user.comparePassword(newPassword);
            if(passwordMatch) return res.status(400).json({ message: message.warning.NoChangesMade });

            user.password = newPassword;
            await user.save();

            res.status(200).json({ message: message.success.UpdateOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getData(nickname: string) { 
        try {
            const user = await UserModel.findOne({ nickname, deleted: false });
            if(!user) return null;

            return { 
                nickname: user.nickname,
                email: user.email,
                url_image: user.url_image,
            };
        } catch (error: any) {
            return { message: error.message };
        }
    }
}

export default UserController;