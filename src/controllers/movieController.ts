import { NextFunction, Request, Response } from "express"
import ReviewController from "./reviewController";
import formatTrailerSearch from "../utils/formatTrailerSearch";
import message from '../json/messages.json';

class MovieController {
    async getDetailsByMovieId(req: Request, res: Response, next: NextFunction){
        const { movieId } = req.body;
        if(!movieId) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const urlDetails = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
            const responseDetailsFetch = await fetch(urlDetails, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(!responseDetailsFetch.ok) return res.status(400).json({ message: message.error.TMDBError });

            const urlActors = `https://api.themoviedb.org/3/movie/${movieId}/credits`
            const responseActorsFetch = await fetch(urlActors, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(!responseActorsFetch.ok) return res.status(400).json({ message: message.error.TMDBError });
            
            const details = await responseDetailsFetch.json() as any;
            const actors = await responseActorsFetch.json() as any;
            const reviews = await ReviewController.getAllByMovieId(movieId);

            const titleForSearch = formatTrailerSearch(details.original_title);
            const urlSearchTrailer = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBWIfnXs70L2d4nMEVJp4-Jzn7_U8a1mEU&part=snippet&q=${titleForSearch}`;

            const responseTrailer = await fetch(urlSearchTrailer, {
                method: 'GET',
                headers: { accept: 'application/json' }
            });

            let trailerId = null
            
            if(responseTrailer.status !== 200)  trailerId = null;
            else {
                const trailer = await responseTrailer.json() as any;
                trailerId = trailer.items[0].id.videoId;
            }

            const formatedResponse = {
                trailerId,
                poster_path: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
                original_title: details.original_title,
                runtime: details.runtime,
                overview: details.overview,
                release_date: details.release_date,
                audience_score: details.vote_average,
                genres: details.genres.map((genre: any) => genre.name),
                actors: actors.cast.map((actor: any) => actor.name),
                director: actors.crew.find((crew: any) => crew.known_for_department === 'Directing')?.name,
                reviews
            }

            return res.status(200).json({ movieDetails: formatedResponse });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default MovieController;