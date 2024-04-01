import { Router } from "express";
import ReviewController from "../controllers/reviewController";

const reviewRouter = Router();
const review = new ReviewController();

reviewRouter.post('/create', review.create);
reviewRouter.delete('/delete', review.delete);
reviewRouter.put('/updateContent', review.updateContent);
reviewRouter.put('/updateScore', review.updateScore);
reviewRouter.get('/getAllByUserId', review.getAllByUserId);
reviewRouter.post('/getAllByMovieId', review.getAllByMovieId);

export default reviewRouter;