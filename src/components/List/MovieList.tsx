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

const genres = [
    "приключения",
    "анимэ",
    "биография",
    "комедия",
    "криминал",
    "документальный",
    "драма",
    "семейный",
    "фэнтези",
    "история",
    "ужасы",
    "мистерия",
    "романтика",
    "научная фантастика",
    "триллер",
    "война",
    "вестерн"
];

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([])
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
    const [isFavourites, setIsFavourites] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [ratingRange, setRatingRange] = useState<{ min: number, max: number }>({ min: 0, max: 10 })
    const [yearRange, setYearRange] = useState<{ min: number, max: number }>({ min: 1990, max: 2024 })
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])

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

    const filteredMovies = movies.filter(movie =>
        movie.rating >= ratingRange.min &&
        movie.rating <= ratingRange.max &&
        movie.year >= yearRange.min &&
        movie.year <= yearRange.max &&
        (selectedGenres.length === 0 || movie.genres.every(genre => selectedGenres.includes(genre.name)))
    )

    return (
        <div>
            <button onClick={() => { setIsFavourites(!isFavourites) }}>
                {isFavourites ? 'Показать все фильмы' : 'Показать избранные'}
            </button>

            {!isFavourites && <button onClick={() => setIsFilter(!isFilter)}>
                {isFilter ? 'Скрыть фильтры' : 'Показать фильтры'}
            </button>}

            {!isFavourites && isFilter ?
                <div className='Filters'>
                    <label>Рейтинг:</label>
                    <input type="number" value={ratingRange.min} onChange={e => setRatingRange({ ...ratingRange, min: parseInt(e.target.value) })} />
                    <input type="number" value={ratingRange.max} onChange={e => setRatingRange({ ...ratingRange, max: parseInt(e.target.value) })} />

                    <label>Год выпуска:</label>
                    <input type="number" value={yearRange.min} onChange={e => setYearRange({ ...yearRange, min: parseInt(e.target.value) })} />
                    <input type="number" value={yearRange.max} onChange={e => setYearRange({ ...yearRange, max: parseInt(e.target.value) })} />

                    <label>Жанры</label>
                    <select value={selectedGenres.join(',')} onChange={e => {
                        const selectedGenre = e.target.value;
                        if (selectedGenre === 'All') {
                            setSelectedGenres([]);
                        } else {
                            setSelectedGenres([selectedGenre]);
                        }
                    }}>
                        <option value="All">Все жанры</option>
                        {genres.map(genre => (
                            <option value={genre} key={genre}>{genre}</option>
                        ))}
                    </select>

                </div>
                : null
            }

            <ul>
                {isFavourites ? favoriteMovies.map(movie => {
                    return (
                        <li key={movie.id}>
                            <Link to={`/movie/${movie.id}`}>
                                <MovieCard movie={movie} onAddToFavourites={() => addToFavourites(movie)} isFavourite={isMovieFavourite(movie.id)} />
                            </Link>
                        </li>
                    )
                }) : filteredMovies.map(movie => {
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