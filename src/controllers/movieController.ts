import { NextFunction, Request, Response } from "express"
import ReviewController from "./reviewController";
import formatTrailerSearch from "../utils/formatTrailerSearch";
import message from '../json/messages.json';

class MovieController {

    async getDetailsByMovieId(req: Request, res: Response, next: NextFunction){
        const { movieId } = req.body;
        if(!movieId) return res.status(400).json({ message: message.error.MissingFields });

        try {
            let responseDetails = null;
            let responseActors = null;
            const urlMovieDetails = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
            const urlTvDetails = `https://api.themoviedb.org/3/tv/${movieId}?language=en-US`;

            const responseMovieDetails = await fetch(urlMovieDetails, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(responseMovieDetails.status === 404) {
                const responseTvDetails = await fetch(urlTvDetails, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                    }
                });

                if(responseTvDetails.status === 404) return res.status(404).json({ message: message.error.NotResultsFound });
                responseDetails = responseTvDetails;
            } else responseDetails = responseMovieDetails;

            const urlMovieActors = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
            const urlTvActors = `https://api.themoviedb.org/3/tv/${movieId}/credits`;
            const responseMovieActors = await fetch(urlMovieActors, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(responseMovieActors.status === 404) {
                const responseTvActors = await fetch(urlTvActors, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                    }
                });

                if(responseTvActors.status === 404) return res.status(404).json({ message: message.error.NotResultsFound });
                responseActors = responseTvActors;
            } else responseActors = responseMovieActors;
            
            const details = await responseDetails.json() as any;
            const actors = await responseActors.json() as any;
            const reviews = await ReviewController.getAllByMovieId(movieId);

            const titleForSearch = formatTrailerSearch(details.original_title || details.name);
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
                original_title: details.original_title || details.name,
                runtime: details.runtime || `${details.number_of_seasons} seasons`,
                overview: details.overview,
                release_date: details.release_date  || details.first_air_date,
                audience_score: details.vote_average,
                genres: details.genres.map((genre: any) => genre.name),
                actors: actors.cast.map((actor: any) => actor.name),
                director: actors.crew.find((crew: any) => crew.known_for_department === 'Directing')?.name || details.created_by[0].name,
                reviews
            }

            return res.status(200).json({ movieDetails: formatedResponse });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async searchByName(req: Request, res: Response, next: NextFunction){
        const { movieName } = req.body;
        if(!movieName) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const TMDB_ROOT = 'https://api.themoviedb.org/3';
            const urlSearchByMovie = `${TMDB_ROOT}/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1`;
            const urlSearchByTv = `${TMDB_ROOT}/search/tv?query=${movieName}&include_adult=false&language=en-US&page=1`;

            const responseSearchMovie = await fetch(urlSearchByMovie, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(responseSearchMovie.status !== 200) return res.status(400).json({ message: message.error.TMDBError });

            const responseSearchTv = await fetch(urlSearchByTv, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(responseSearchTv.status !== 200) return res.status(400).json({ message: message.error.TMDBError });

            const movies = await responseSearchMovie.json() as any;
            const tvs = await responseSearchTv.json() as any;

            const formatedResponse = {
                movies: movies.results.length > 0 ? await Promise.all(movies.results.slice(0, 6).map(async (movie: any) => {
                    let actors = null;
                    let director = null;
                    const urlActors = `https://api.themoviedb.org/3/movie/${movie.id}/credits`;
                    const responseActors = await fetch(urlActors, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                        }
                    });

                    if(responseActors.status !== 200) {
                        actors = null;
                        director = null;
                    } else{
                        const actorsResponse = await responseActors.json() as any;
                        actors = actorsResponse.cast.map((actor: any) => actor.name);
                        director = actorsResponse.crew.find((crew: any) => crew.known_for_department === 'Directing')?.name;
                    }

                    return {
                        id: movie.id,
                        title: movie.original_title,
                        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                        release_date: movie.release_date,
                        audience_score: movie.vote_average,
                        actors,
                        director
                    }
                })) : [],
                tvs: tvs.results.length > 0 ? await Promise.all(tvs.results.slice(0, 6).map(async (tv: any) => {
                    let actors = null;
                    let director = null;
                    const urlActors = `https://api.themoviedb.org/3/tv/${tv.id}/credits`;
                    const responseActors = await fetch(urlActors, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                        }
                    });

                    if(responseActors.status !== 200) {
                        actors = null;
                        director = null;
                    } else{
                        const actorsResponse = await responseActors.json() as any;
                        actors = actorsResponse.cast.map((actor: any) => actor.name);
                        director = actorsResponse.crew.find((crew: any) => crew.known_for_department === 'Creator')?.name;
                    }
                    return {
                        id: tv.id,
                        title: tv.original_name,
                        poster_path: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
                        release_date: tv.first_air_date,
                        audience_score: tv.vote_average,
                        actors,
                        director
                    }
                })) : []
            }

            return res.status(200).json({ searchResult: formatedResponse });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async searchByGenre(req: Request, res: Response, next: NextFunction) {
        const genres = req.body.genres as string[];
        if(!genres) return res.status(400).json({ message: message.error.MissingFields });

        try {
            const TMDB_ROOT = 'https://api.themoviedb.org/3';
            const urlMovies = `${TMDB_ROOT}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genres.join('%')}`;
            const urlTvs = `${TMDB_ROOT}/discover/tv?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genres.join('%')}`;
            
            const responseMovies = await fetch(urlMovies, {
                method: 'GET', 
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(responseMovies.status !== 200) return res.status(400).json({ message: message.error.TMDBError });

            const responseTvs = await fetch(urlTvs, {
                method: 'GET', 
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                }
            });

            if(responseTvs.status !== 200) return res.status(400).json({ message: message.error.TMDBError });

            const movies = await responseMovies.json() as any;
            const tvs = await responseTvs.json() as any;

            const formatedResponse = {
                movies: movies.results.length > 0 ? await Promise.all(movies.results.slice(0, 8).map(async (movie: any) => {
                    let actors = null;
                    let director = null;
                    const urlActors = `https://api.themoviedb.org/3/movie/${movie.id}/credits`;
                    const responseActors = await fetch(urlActors, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                        }
                    });

                    if(responseActors.status !== 200) {
                        actors = null;
                        director = null;
                    } else{
                        const actorsResponse = await responseActors.json() as any;
                        actors = actorsResponse.cast.map((actor: any) => actor.name);
                        director = actorsResponse.crew.find((crew: any) => crew.known_for_department === 'Directing')?.name;
                    }

                    return {
                        id: movie.id,
                        title: movie.original_title,
                        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                        release_date: movie.release_date,
                        audience_score: movie.vote_average,
                        actors,
                        director
                    }
                })) : [],
                tvs: tvs.results.length > 0 ? await Promise.all(tvs.results.slice(0, 8).map(async (tv: any) => {
                    let actors = null;
                    let director = null;
                    const urlActors = `https://api.themoviedb.org/3/tv/${tv.id}/credits`;
                    const responseActors = await fetch(urlActors, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjEzODkzMTU1YzJmZjY4OGJkODMyZTRkMWJiZTlhMCIsInN1YiI6IjY2MDJmMjM4Yjg0Y2RkMDE0YWY1NTFiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pSTbcbWcScjdicQLg6ssg1HTCr_2CKNW9qhQnynwjME`
                        }
                    });

                    if(responseActors.status !== 200) {
                        actors = null;
                        director = null;
                    } else{
                        const actorsResponse = await responseActors.json() as any;
                        actors = actorsResponse.cast.map((actor: any) => actor.name);
                        director = actorsResponse.crew.find((crew: any) => crew.known_for_department === 'Creator')?.name;
                    }
                    return {
                        id: tv.id,
                        title: tv.original_name,
                        poster_path: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
                        release_date: tv.first_air_date,
                        audience_score: tv.vote_average,
                        actors,
                        director
                    }
                })) : []
            }

            return res.status(200).json({ searchResult: formatedResponse });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default MovieController;