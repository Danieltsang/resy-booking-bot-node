# Resy Reservation Script

Not so much a bot yet but a convenient and efficient method of booking a reservation through resy without using their website.

It reduces any time spent clicking through their platform and calls Resy's API directly to snatch a reservation.

## Config variables

Found in `config.js`, these are necessary to run the script. You can find some of these values by logging into Resy online. Navigating to any restaurant. Open your developer tools. Click the Network tab. Refresh the page and look at any of the Resy API requests.

AUTH_TOKEN = `x-resy-auth-token` header

API_KEY = `authorization` header. Looks like `ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"` but you only need the value after `api_key` without the quotes.

VENUE_ID = `venue_id` query param. Can be found within the `https://api.resy.com/4/find?day=2020-10-09&lat=0&long=0&party_size=4&venue_id=34814` request.

DAY = YYYY-MM-DD format;

TIMES = An array of time preferences you want your reservation at. e.g `['18:00:00', '18:15:00']`;

PARTY_SIZE = The number of people for the reservation;

DINING_TYPE = If you know the dining type, you can enter this variable e.g `Outdoor Dining`

## How to run

You must have node installed to run this script.

1. Open `config.js` and fill in each variable.
2. Run `node main.js`

If you see a message like `booked! 18:00:00`, that means you snagged a time. Otherwise, there were no available reservations that matched your time preferences or all reservations are already booked.


Note: Not all restaurants release reservations at 12:00am.