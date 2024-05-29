import axios from 'axios';
import * as config from './config.js';

export default axios.create({
    baseURL: 'https://api.resy.com',
    headers: {
        'x-resy-auth-token': config.AUTH_TOKEN,
        authorization: `ResyAPI api_key="${config.API_KEY}"`,
    },
});
