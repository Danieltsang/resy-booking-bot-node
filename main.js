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

const MAX_RECURSIONS = 10;

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function book(user, numRequest = 1) {
  if (numRequest > MAX_RECURSIONS) {
    signale.fatal(`Unable to find a reservation after ${MAX_RECURSIONS} attempts`);
    return true;
  }

  const reservations = await api.findReservations();

  signale.debug('Num reservations available', reservations.length);

  if (reservations.length === 0) {
    signale.debug(`Request #${numRequest} failed, sleeping for 1 second`);
    await timeout(1000);
    return await book(user, numRequest + 1);
  }

  let booked = false;
  for (const reservation of reservations) {
    const [day, timeSlot] = reservation.date.start.split(' ');
    signale.debug('Available timeslot', timeSlot, reservation.config.type);

    if (helper.isReservationMatch({ reservation, timeSlot })) {
      signale.success('Matched time preference!', timeSlot);
      const { bookToken } = await api.getReservationDetails(reservation);

      await api.bookReservation({ user, bookToken });
      signale.success(`Booked! ${timeSlot}`);

      booked = true;

      break;
    }
  }

  if (!booked) {
    signale.fatal('Unable to find suitable timeslot.')
  }

  return true;
}

async function main() {
  signale.debug(config);

  const user = await api.findUser();

  signale.pending('Starting to look for timeslots...')
  await book(user);

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
