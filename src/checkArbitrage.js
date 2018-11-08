const log = require('./log').child({ ns: 'checkArbitrage' });

module.exports = async job => {
  log.info('checking for arbitrage');
};
