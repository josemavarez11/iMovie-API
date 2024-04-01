import { Router } from "express";
import MessageController from "../controllers/messageController";

const messageRouter = Router();
const message = new MessageController();

messageRouter.post('/create', message.create);

export default messageRouter;