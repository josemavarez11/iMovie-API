import { Request, Response } from "express"
import UserModel from "../models/userModel";
import MessageModel from "../models/messageModel";

class MessageController {
    async getAll(req: Request, res: Response) {
        try {
            const messages = await MessageModel.find();

            const formattedMessages = await Promise.all(messages.map(async message => {
                const user = await UserModel.findById(message.user);
                return {
                    message,
                    user: { _id: user?._id, nickname: user?.nickname }
                }
            }))

            return res.status(200).json(formattedMessages);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default MessageController;