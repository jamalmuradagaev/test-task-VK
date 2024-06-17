import React from 'react';
import s from './style.module.css'

interface Movie {
  id: number;
  name: string;
  poster: string;
  year: number;
  rating: number;
}

interface MovieCardProps {
  movie: Movie;
  onAddToFavourites: () => void;
  isFavourite: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onAddToFavourites, isFavourite }) => {
  return (
    <>
      <div className={s.card}>
        <img src={movie.poster} alt='Постер не доступен' />
        <h2>{movie.name}</h2>
        <p>Год: {movie.year}</p>
        <p>Рейтинг: {movie.rating}</p>
        <button onClick={(e) => {
          e.preventDefault();
          onAddToFavourites();
        }}>{isFavourite ? 'Удалить из избранного' : 'Добавить в избранное'}</button>
      </div>
    </>
  );
};

export default MovieCard;