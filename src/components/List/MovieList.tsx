import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from '../MovieCard/MovieCard';
import { Link } from 'react-router-dom';
import { genres, Movie, Genre } from '../../data';

const MovieList = () => {
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

    // добавление в избранное
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

    const isMovieFavourite = (movieId: number) => {
        return favoriteMovies.some(movie => movie.id === movieId && movie.isFavourite)
    }

    // вывод данных из сервера
    useEffect(() => {
        axios
            .get('https://api.kinopoisk.dev/v1.4/movie', {
                headers: {
                    accept: 'application/json',
                    'X-API-KEY': 'K6ZYE04-Y7V4H63-PJRT2D6-P4ST2G0'
                }
            })
            .then(function (response) {
                setMovies(response.data.docs.map((item: Movie) => ({
                    id: item.id,
                    name: item.name,
                    poster: item.poster,
                    year: item.year,
                    rating: item.rating,
                    description: item.description,
                    genres: item.genres.map((genre: Genre) => genre.name),
                    isFavourite: isFavourites,
                })));
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [ratingRange, yearRange, selectedGenres])

    // console.log(movies)

    // фильтрация 
    const filteredMovies = movies.filter(movie =>
        movie.rating.imdb >= ratingRange.min &&
        movie.rating.imdb <= ratingRange.max &&
        movie.year >= yearRange.min &&
        movie.year <= yearRange.max &&
        (selectedGenres.length === 0 || movie.genres.some(genre => selectedGenres.includes(genre)))
    )

    console.log(filteredMovies)

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
                        const selectedGenre= e.target.value;
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
                })
                : filteredMovies.map(movie => {
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