import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from '../MovieCard/MovieCard';
import { Link } from 'react-router-dom';

const options = {
    method: 'GET',
    url: 'https://api.kinopoisk.dev/v1.4/movie',
    headers: { accept: 'application/json', 'X-API-KEY': 'K6ZYE04-Y7V4H63-PJRT2D6-P4ST2G0' }
};

export interface Genre {
    name: string;
}

interface Movie {
    id: number,
    name: string,
    poster: string,
    year: number,
    rating: number,
    description: string,
    genres: Genre[],
    isFavourite: boolean,
}

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([])
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
    const [isFavourites, setIsFavourites] = useState(false)

    useEffect(() => {
        const storedFavoriteMovies = localStorage.getItem('favoriteMovies');
        if (storedFavoriteMovies) {
            const parsedFavoriteMovies = JSON.parse(storedFavoriteMovies);
            setFavoriteMovies(parsedFavoriteMovies);
        }
    }, []);

    const addToFavourites = (movie: Movie) => {
        const isAlreadyFavourite = favoriteMovies.some(m => m.id === movie.id);
        let newFavoriteMovies;
        if (isAlreadyFavourite) {
            newFavoriteMovies = favoriteMovies.filter(m => m.id !== movie.id);
        } else {
            newFavoriteMovies = [...favoriteMovies, { ...movie, isFavourite: true }];
        }
        setFavoriteMovies(newFavoriteMovies);
        localStorage.setItem('favoriteMovies', JSON.stringify(newFavoriteMovies));
    }

    const isMovieFavourite = (movieId: number) => favoriteMovies.some(movie => movie.id === movieId && movie.isFavourite)

    useEffect(() => {
        axios
            .request(options)
            .then(function (response) {
                setMovies(response.data.docs.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    poster: item.poster?.url,
                    year: item.year,
                    rating: item.rating.imdb,
                    description: item.description,
                    genres: item.genres.map((genre: any) => genre.name),
                    isFavourite: false,
                })));
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [])

    console.log(movies)

    return (
        <div>
            <button onClick={() => setIsFavourites(!isFavourites)}>
                {isFavourites ? 'Показать все фильмы' : 'Показать избранные'}</button>
            <ul>
                {isFavourites ? favoriteMovies.map(movie => {
                    return (
                        <li key={movie.id}>
                            <Link to={`/movie/${movie.id}`}>
                                <MovieCard movie={movie} onAddToFavourites={() => addToFavourites(movie)} isFavourite={isMovieFavourite(movie.id)} />
                            </Link>
                        </li>
                    )
                }) : movies.map(movie => {
                    return (
                        <li key={movie.id}>
                            <Link to={`/movie/${movie.id}`}>
                                <MovieCard movie={movie} onAddToFavourites={() => addToFavourites(movie)} isFavourite={isMovieFavourite(movie.id)} />
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default MovieList