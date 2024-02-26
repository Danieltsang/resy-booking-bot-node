import logger from './src/logger.js';
import api from './src/api.js';

async function main() {
  const name = process.argv[2];

  if (!name) {
    logger.fatal('Please provide restaurant name: npm run get-id NAME');
    return;
  }

  logger.pending(`Looking for ${name} ID...`)

  const venue = await api.findVenue(name);

  logger.debug('ID:', venue.id.resy);
  logger.debug('Name:', venue.name);
  logger.debug('Contact:', venue.contact);

  return;
}

main()
  .then(() => {
    logger.success('Finished');
  })
  .catch(err => {
    logger.fatal(
      'Unexpected error',
      (err && err.response && err.response.data) || err,
    );
  });
