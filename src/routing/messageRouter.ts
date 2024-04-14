import { Router } from "express";
import MessageController from "../controllers/messageController";

const messageRouter = Router();
const message = new MessageController();

messageRouter.get("/", message.getAll);

export default messageRouter;