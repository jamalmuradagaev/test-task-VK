export interface Genre {
    name: string;
}

export interface Movie {
    id: number,
    name: string,
    poster: { url: string},
    year: number,
    rating: { imdb: number },
    description: string,
    genres: Genre[],
    isFavourite?: boolean,
}

export const genres = [
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