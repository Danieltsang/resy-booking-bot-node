import logger from './src/logger.js';
import api from './src/api.js';
import * as config from './src/config.js';
import * as helper from './src/helper.js';

const MAX_RECURSIONS = 10;

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function book(user, numRequest = 1) {
  if (numRequest > MAX_RECURSIONS) {
    logger.fatal(`Unable to find a reservation after ${MAX_RECURSIONS} attempts`);
    return true;
  }

  const reservations = await api.findReservations();

  logger.debug('Num reservations available', reservations.length);

  if (reservations.length === 0) {
    logger.debug(`Request #${numRequest} failed, sleeping for 1 second`);
    await timeout(1000);
    return await book(user, numRequest + 1);
  }

  let booked = false;
  for (const reservation of reservations) {
    const [, timeSlot] = reservation.date.start.split(' ');
    logger.debug('Available timeslot', timeSlot, reservation.config.type);

    if (helper.isReservationMatch({ reservation, timeSlot })) {
      logger.success('Matched time preference!', timeSlot);
      const details = await api.getReservationDetails(reservation);
      logger.info(details);
      const { bookToken } = details;

      await api.bookReservation({ user, bookToken });
      logger.success(`Booked! ${timeSlot}`);

      booked = true;

      break;
    }
  }

  if (!booked) {
    logger.fatal('Unable to find suitable timeslot.')
  }

  return;
}

async function main() {
  logger.debug(config);

  const user = await api.findUser();

  logger.pending('Starting to look for timeslots...')
  await book(user);

  return;
}

main()
  .then(() => {
    logger.success('Finished');
  })
  .catch(err => {
    logger.fatal(
      'Unexpected error',
      (err && err.response && err.response.status) || '',
      (err && err.response && err.response.statusText) || '',
      (err && err.response && err.response.data) || err,
    );
  });
