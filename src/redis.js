const Redis = require('ioredis');
const env = require('./env');

const queue = new Redis(env.queueRedisUrl, {
  enableReadyCheck: true,
});

module.exports = { queue };
