const Queue = require('bull');
const env = require('./env');

const checkArbitrage = new Queue('checkArbitrage', env.queueRedisUrl);

module.exports = {
  checkArbitrage,
};
