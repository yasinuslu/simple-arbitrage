const mongoose = require('mongoose');

mongoose.connect(process.env.APP_MONGO_URL);

module.exports = {
  Arbitrage: require('./Arbitrage'),
};
