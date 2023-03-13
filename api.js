const querystring = require('querystring');
const _ = require('lodash');

const config = require('./config');

class API {
  constructor(opts) {
    this.instance = opts.instance;
  }

  async findVenue(name) {
    const res = await this.instance.get(`/3/venue?url_slug=${name}&location=ny`);

    return res.data;
  }

  async findUser() {
    const res = await this.instance.get('/2/user');

    return res.data;
  }

  async findReservations() {
    const res = await this.instance.get('/4/find', {
      params: {
        day: config.DAY,
        lat: 0,
        long: 0,
        party_size: config.PARTY_SIZE,
        venue_id: config.VENUE_ID,
      },
    });

    return _.get(res, 'data.results.venues[0].slots', []);
  }

  async getReservationDetails(reservation) {
    const res = await this.instance.get('/3/details', {
      params: {
        config_id: reservation.config.token,
        day: config.DAY,
        party_size: config.PARTY_SIZE,
      },
    });

    return { bookToken: res.data.book_token.value, details: res.data };
  }

  async bookReservation({ user, bookToken }) {
    const defaultPaymentMethod = user.payment_methods.find(
      pm => pm.is_default === true,
    );
    const params = querystring.stringify({
      book_token: bookToken,
      struct_payment_method: `{ "id": ${defaultPaymentMethod.id} }`,
      source_id: 'resy.com-venue-details',
    });
    const res = await this.instance({
      url: '/3/book',
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: params,
    });

    return res.data;
  }
}

module.exports = API;
