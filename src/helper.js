import * as config from './config.js';

const hasTimeslot = timeSlot => config.TIMES.includes(timeSlot);
const isMatchingDiningType = type => {
  if (!config.DINING_TYPE) return true;
  return type === config.DINING_TYPE;
};

export function isReservationMatch({ reservation, timeSlot }) {
  return hasTimeslot(timeSlot) && isMatchingDiningType(reservation.config.type);
}
