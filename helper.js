const config = require('./config');

function isReservationMatch({ reservation, timeSlot }) {
  return (
    config.TIMES.includes(timeSlot) &&
    config.DINING_TYPE &&
    reservation.config.type === config.DINING_TYPE
  );
}

module.exports = { isReservationMatch };
