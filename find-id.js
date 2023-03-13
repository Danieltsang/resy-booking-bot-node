const axios = require('axios');
const signale = require('signale');

const API = require('./api');
const config = require('./config');
const helper = require('./helper');

const instance = axios.create({
  baseURL: 'https://api.resy.com',
  headers: {
    'x-resy-auth-token': config.AUTH_TOKEN,
    authorization: `ResyAPI api_key="${config.API_KEY}"`,
  },
});

const api = new API({ instance });

async function main() {
  const name = process.argv[2];

  if (!name) {
    signale.fatal('Please provide restaurant name: node find-id.js NAME');
    return;
  }

  signale.pending(`Looking for ${name} ID...`)

  const venue = await api.findVenue(name);

  signale.debug('ID:', venue.id.resy);
  signale.debug('Name:', venue.name);
  signale.debug('Contact:', venue.contact);

  return;
}

main()
  .then(() => {
    signale.success('Finished');
  })
  .catch(err => {
    signale.fatal(
      'Unexpected error',
      (err && err.response && err.response.data) || err,
    );
  });
