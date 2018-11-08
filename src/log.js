const pino = require('pino');

const log = pino({ name: 'pro-arb' });

module.exports = log;
