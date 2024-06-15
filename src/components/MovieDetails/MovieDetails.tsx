import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import s from './style.module.css'
import { Genre } from '../List/MovieList';

interface Movie {
    id: number;
    name: string;
    poster: {
        url: string;
    };
    description: string;
    rating: {
        imdb: number
    };
    year: number;
    genres: Genre[];
}

const MovieDetail: React.FC = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        axios
            .request({
                method: 'GET',
                url: `https://api.kinopoisk.dev/v1.4/movie/${id}`,
                headers: { accept: 'application/json', 'X-API-KEY': 'K6ZYE04-Y7V4H63-PJRT2D6-P4ST2G0' }
            })
            .then(response => {
                setMovie(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);

    if (!movie) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={s.card}>
            <div className={s.image}>
                {movie.poster ? <img src={movie.poster.url} alt={movie.name} /> : <p>Постер не доступен</p>}
            </div>
            <div className={s.info}>
                <h1>{movie.name}</h1>
                {movie.description ? <p>{movie.description}</p> : 'нет описания'}
                <p>Рейтинг: {movie.rating.imdb}</p>
                <p>Дата выхода: {movie.year}</p>
                <p>Жанры: 
                    {movie.genres.map((genre: any, i) => {
                        return (
                            <span key={i}> {genre.name}{i < movie.genres.length - 1 ? ', ' : ''}</span>
                        )
                    })}
                </p>
            </div>
        </div>
    );
};

export default MovieDetail;