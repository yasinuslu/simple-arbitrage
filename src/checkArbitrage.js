// const ccxt = require('ccxt');

const Fiat = require('./fiat');
const log = require('./log').child({ ns: 'checkArbitrage' });

const fiat = new Fiat();
// const binance = new ccxt.binance();
// const btcTurk = new ccxt.btcturk();

module.exports = async job => {
  try {
    const usdTry = await fiat.fetchTicker();
    log.info('usd/try: %d', usdTry.buy);
    log.info('checking for arbitrage');
    // const orderBook = await binance.fetchOrderBook('ETH/USDT');
    // log.info('orderBook %o', orderBook);
    // const orderBook = await btcTurk.fetchOrderBook('ETH/TRY');
    // log.info('orderBook %o', orderBook);
  } catch (err) {
    log.error('error while checking for arbitrages\n%s', err.stack);
  }
};
