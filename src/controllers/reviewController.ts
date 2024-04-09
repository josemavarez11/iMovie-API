import { NextFunction, Request, Response } from "express"
import message from '../json/messages.json';
import ReviewModel from "../models/reviewModel";
import UserModel from "../models/userModel";

class ReviewController {
    async create(req: Request, res: Response, next: NextFunction) { //tested ok
        const id = (req as any).user;
        const { content, score, movieId } = req.body;
        if (!content || !score || !movieId) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const reviewExists = await ReviewModel.find({ user: id, movieId, deleted: false});
            if (reviewExists.length > 0) return res.status(400).json({ message: message.error.ExistingReview });

            const review = new ReviewModel({ content, score, user: id, movieId });
            await review.save();

            res.status(201).json({ message: message.success.ReviewCreated });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) { //tested ok
        const id = (req as any).user;
        const { movieId } = req.body;
        if (!movieId) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const review = await ReviewModel.findOne({ user: id, movieId, deleted: false});
            if (!review) return res.status(400).json({ message: message.error.ReviewNotFound });

            review.deleted = true;
            await review.save();

            res.status(200).json({ message: message.success.DeleteOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateContent(req: Request, res: Response, next: NextFunction) { //tested ok
        const id = (req as any).user;
        const { movieId, newContent } = req.body;
        if (!movieId || !newContent) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const review = await ReviewModel.findOne({ user: id, movieId, deleted: false});
            if (!review) return res.status(400).json({ message: message.error.ReviewNotFound });

            review.content = newContent;
            await review.save();

            res.status(200).json({ message: message.success.UpdateOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message }); 
        }
    }

    async updateScore(req: Request, res: Response, next: NextFunction) { //tested ok
        const id = (req as any).user;
        const { movieId, newScore } = req.body;
        if (!movieId || !newScore) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const review = await ReviewModel.findOne({ user: id, movieId, deleted: false});
            if (!review) return res.status(400).json({ message: message.error.ReviewNotFound });

            review.score = newScore;
            await review.save();

            res.status(200).json({ message: message.success.UpdateOk });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllByUserId(req: Request, res: Response, next: NextFunction) { //tested ok, it still needs the movie poster path 
        const id = (req as any).user;
        try {
            const reviews = await ReviewModel.find({ user: id, deleted: false });
            if(reviews.length === 0) return res.status(404).json({ message: message.error.ReviewNotFound });

            const formattedReviews = reviews.map(review => {
                return {
                    _id: review._id,
                    content: review.content,
                    score: review.score,
                    movie: {
                        movieId: review.movieId,
                        moviePosterPath: 'get movie poster path here'
                    }
                }
            });

            return res.status(200).json(formattedReviews);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getAllByMovieId(movieId: number) { //tested ok
        try {
            const reviews = await ReviewModel.find({ movieId, deleted: false });
            if (reviews.length === 0) return null;

            const formattedReviews = await Promise.all(reviews.map(async review => {
                const user = await UserModel.findById(review.user);
                return {
                    _id: review._id,
                    content: review.content,
                    score: review.score,
                    user: {
                        userId: user?._id,
                        nickname: user?.nickname,
                        url_image: user?.url_image
                    }
                }
            }));

            return formattedReviews;
        } catch (error: any) {
            return { message: error.message };
        }
    }
}

export default ReviewController;