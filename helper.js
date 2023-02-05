const config = require('./config');

const hasTimeslot = timeSlot => config.TIMES.includes(timeSlot);
const isMatchingDiningType = type => {
  if (!config.DINING_TYPE) return true;
  return type === config.DINING_TYPE;
};

function isReservationMatch({ reservation, timeSlot }) {
  return hasTimeslot(timeSlot) && isMatchingDiningType(reservation.config.type);
}

module.exports = { isReservationMatch };
