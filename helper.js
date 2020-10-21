const config = require('./config');

const hasTimeslot = timeSlot => config.TIMES.includes(timeSlot);
const isMatchingDiningType = type => {
  if (!config.DINING_TYPE) return true;
  return type === config.DINING_TYPE;
};

function isReservationMatch({ reservation, timeSlot }) {
  return hasTimeslot(timeSlot) && isMatchingDiningType(reservation.config.type);
}

function printConfig(conf) {
  console.log(JSON.stringify(conf, null, 2));
}

module.exports = { isReservationMatch, printConfig };
