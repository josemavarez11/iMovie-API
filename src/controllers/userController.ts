import { NextFunction, Request, Response } from "express"
import message from '../json/messages.json';
import UserModel from "../models/userModel";

class UserController {
    async update(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        const { newNickname, newEmail, newPassword, urlImage } = req.body;

        if(!id && (!newNickname || !newEmail || !newPassword)) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: message.error.UserNotFound });

            const nicknameMatch = user.compareNickname(newNickname);
            const emailMatch = user.compareEmail(newEmail);
            const passwordMatch = await user.comparePassword(newPassword);

            if(nicknameMatch && emailMatch && passwordMatch) return res.status(400).json({ message: message.warning.NoChangesMade });

            if(newNickname && newNickname !== '') user.nickname = newNickname;
            if(newEmail && newEmail !== '') user.email = newEmail;
            if(newPassword && newPassword !== '') user.password = newPassword;

            await user.save();

            res.status(200).json({ message: message.success.UpdateOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

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