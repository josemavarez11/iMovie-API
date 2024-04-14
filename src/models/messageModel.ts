import { getModelForClass, prop, Ref, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
    @prop({ required: true, unique: false })
    content!: string;

    @prop({ required: true, unique: false })
    user!: string;
}
const MessageModel = getModelForClass(Message);

export default MessageModel;