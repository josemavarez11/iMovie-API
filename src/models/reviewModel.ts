import { getModelForClass, prop, pre, Ref } from "@typegoose/typegoose";
import { User } from "./userModel";

export class Review {
    @prop({ required: true, unique: false})
    content!: string;

    @prop({ required: true, min: 0, max: 5 })
    score!: number;

    @prop({ required: true, ref: () => User, type: () => User})
    user!: Ref<User>;

    @prop({ required: true, unique: false })
    movieId!: string;

    @prop({ required: false, unique: false, default: 'https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg'})
    poster?: string;

    @prop({ required: false, default: false })
    deleted?: boolean;
}

const ReviewModel = getModelForClass(Review);
export default ReviewModel;
