import { Router } from "express";
import MovieController from "../controllers/movieController";

const movieRouter = Router();
const movie = new MovieController();

movieRouter.post('/getDetailsByMovieId', movie.getDetailsByMovieId);
movieRouter.post('/searchByName', movie.searchByName);
movieRouter.post('/searchByGenre', movie.searchByGenre);

export default movieRouter;