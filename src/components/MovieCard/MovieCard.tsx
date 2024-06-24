import s from './style.module.css'
import { Movie } from '../../data';

interface MovieCardProps {
  movie: Movie;
  onAddToFavourites: () => void;
  isFavourite: boolean;
}

const MovieCard = ({ movie, onAddToFavourites, isFavourite }: MovieCardProps) => {
  // console.log('MovieCard props:', movie, onAddToFavourites, isFavourite);
  return (
    <>
      <div className={s.card}>
        <img src={movie.poster?.url} alt='Постер не доступен' />
        <h2>{movie.name}</h2>
        <p>Год: {movie.year}</p>
        <p>Рейтинг: {movie.rating.imdb}</p>
        <button onClick={(e) => {
          e.preventDefault();
          onAddToFavourites();
        }}
        >
          {isFavourite ? 'Удалить из избранного' : 'Добавить в избранное'}
        </button>
      </div>
    </>
  );
};

export default MovieCard;