import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard/MovieCard';

const options = {
    method: 'GET',
    url: 'https://api.kinopoisk.dev/v1.4/movie',
    headers: { accept: 'application/json', 'X-API-KEY': 'K6ZYE04-Y7V4H63-PJRT2D6-P4ST2G0' }
};

interface Movie {
    id: number,
    name: string,
    poster: string,
    year: number,
    rating: number,
}

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([])

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
                })));
            })
            // .catch(function (error) {
            //     console.error(error);
            // });
    }, [])

    console.log(movies)

    return (
        <div>
            <ul>
                {movies.map(movie => {
                    return <MovieCard key={movie.id} movie={movie} />

                })}
            </ul>
        </div>
    );
};

export default MovieList