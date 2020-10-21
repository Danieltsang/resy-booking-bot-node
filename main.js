const axios = require('axios');

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
  try {
    const user = await api.findUser();
    const reservations = await api.findReservations();

    console.log('num reservations available', reservations.length);

    for (const reservation of reservations) {
      const [day, timeSlot] = reservation.date.start.split(' ');
      console.log('available timeslot', timeSlot, reservation.config.type);

      if (helper.isReservationMatch({ reservation, timeSlot })) {
        console.log('matched time preference!', timeSlot);
        const { bookToken } = await api.getReservationDetails(reservation);

        await api.bookReservation({ user, bookToken });
        console.log(`booked! ${timeSlot}`);

        break;
      }
    }

    return { user, reservations };
  } catch (err) {
    console.log(
      'unexpected err',
      (err && err.response && err.response.data) || err,
    );
  }
}

main()
  .then(() => {
    console.log('finished');
  })
  .catch(err => {
    console.log('error', err.response.data);
  });
