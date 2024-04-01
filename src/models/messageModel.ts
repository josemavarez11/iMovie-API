import { getModelForClass, prop, Ref, modelOptions } from "@typegoose/typegoose";
import User from "./userModel";

@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
    @prop({ required: true, unique: false })
    content!: string;

    @prop({ required: true, unique: false, ref: () => User, type: () => typeof User })
    user!: Ref<typeof User>;
}

const MessageModel = getModelForClass(Message);

export default MessageModel;