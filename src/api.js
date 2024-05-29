import querystring from 'querystring';
import _ from 'lodash';
import request from './request.js';
import * as config from './config.js';

class API {
  constructor(opts = {}) {
    this.request = opts.request || request;
  }

  async findVenue(name) {
    const res = await this.request.get(`/3/venue?url_slug=${name}&location=ny`);

    return res.data;
  }

  async findUser() {
    const res = await this.request.get('/2/user');

    return res.data;
  }

  async findReservations() {
    const res = await this.request.get('/4/find', {
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
    const res = await this.request.post('/3/details', {
      commit: 1,
      config_id: reservation.config.token,
      day: config.DAY,
      party_size: config.PARTY_SIZE,
    });

    return { bookToken: res.data.book_token.value, details: res.data };
  }

  async bookReservation({ user, bookToken }) {
    const defaultPaymentMethod = user.payment_methods.find(
      pm => pm.is_default === true,
    );
    const params = querystring.stringify({
      book_token: bookToken,
      struct_payment_method: `{"id":${defaultPaymentMethod.id}}`,
      source_id: 'resy.com-venue-details',
    });
    const res = await this.request({
      url: '/3/book',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Origin': 'https://widgets.resy.com/',
      },
      data: params,
    });

    return res.data;
  }
}

export default new API();
