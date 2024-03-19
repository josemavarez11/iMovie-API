import { NextFunction, Request, Response } from "express"
import UserModel from "../models/userModel";

class UserController {
    static async delete(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        console.log('id', id);
        if(!id) return res.status(400).json({ message: 'Id is required to delete a user.' });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: 'User not found' });

            user.deleted = true;
            await user.save();

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updateEmail(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        const { newEmail } = req.body;

        if(!id || !newEmail) return res.status(400).json({ message: 'Id and new email are required to update email.' });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: 'User not found' });

            const emailMatch = user.compareEmail(newEmail);
            if(emailMatch) return res.status(400).json({ message: 'New email is the same as the current email. No changes made.' });

            user.email = newEmail;
            await user.save();

            res.status(200).json({ message: 'Email updated successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updateNickname(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        const { newNickname } = req.body;

        if(!id || !newNickname) return res.status(400).json({ message: 'Id and new nickname are required to update nickname.' });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: 'User not found' });

            const nicknameMatch = user.compareNickname(newNickname);
            if(nicknameMatch) return res.status(400).json({ message: 'New nickname is the same as the current nickname. No changes made.' });

            user.nickname = newNickname;
            await user.save();

            res.status(200).json({ message: 'Nickname updated successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updatePassword(req: Request, res: Response, next: NextFunction) {
        const id = (req as any).user;
        const { newPassword } = req.body;

        if(!id || !newPassword) return res.status(400).json({ message: 'Id and new password are required to update password.' });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: 'User not found' });

            const passwordMatch = await user.comparePassword(newPassword);
            if(passwordMatch) return res.status(400).json({ message: 'New password is the same as the current password. No changes made.' });

            user.password = newPassword;
            await user.save();

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getNickname(req: Request, res: Response, next: NextFunction) { 
        const id = req.body.id || (req as any).user;
        if(!id) return res.status(400).json({ message: 'Id is required to get a nickname.' });

        try {
            const user = await UserModel.findById(id);
            if(!user) return res.status(400).json({ message: 'User not found' });

            res.status(200).json({ nickname: user.nickname });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default UserController;