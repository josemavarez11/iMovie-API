import { Router } from "express";
import MovieController from "../controllers/movieController";

const movieRouter = Router();
const movie = new MovieController();

movieRouter.post('/getDetailsByMovieId', movie.getDetailsByMovieId);

export default movieRouter;