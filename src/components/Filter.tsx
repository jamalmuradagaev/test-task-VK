import React from 'react';
import axios from 'axios';

const options = {
    method: 'GET',
    url: 'https://api.kinopoisk.dev/v1.4/movie',
    params: { page: '1', limit: '10' },
    headers: { accept: 'application/json', 'X-API-KEY': 'K6ZYE04-Y7V4H63-PJRT2D6-P4ST2G0' }
};

axios
    .request(options)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.error(error);
    });


const MovieCard: React.FC = () => {
    return (
        <h1></h1>
    );
};

export default MovieCard;