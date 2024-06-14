import React from 'react';
import s from './style.module.css'

interface Movie {
  id: number;
  name: string;
  poster: string;
  year: number;
  rating: number;
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <div className={s.card}>
      <img src={movie.poster} alt='Постер не доступен' />
      <h2>{movie.name}</h2>
      <p>Год: {movie.year}</p>
      <p>Рейтинг: {movie.rating}</p>
    </div>
  );
};

export default MovieCard;