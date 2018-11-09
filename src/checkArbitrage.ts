import { connection } from './db';

import Arbitrage from './entity/Arbitrage';

// import Fiat from './fiat';

const log = require('./log').default.child({ ns: 'checkArbitrage' });

// const fiat = new Fiat();
// const binance = new ccxt.binance();
// const btcTurk = new ccxt.btcturk();

export default async job => {
  try {
    // const arb = new Arbitrage();
    // arb.firstName = 'name1';
    // await connection.manager.save(arb);
    log.info('checking for arbitrages');
    // await arb.save();
    // const usdTry = await fiat.fetchTicker();
    // log.info('usd/try: %d', usdTry.buy);
    // log.info('checking for arbitrage');
    // const orderBook = await binance.fetchOrderBook('ETH/USDT');
    // log.info('orderBook %o', orderBook);
    // const orderBook = await btcTurk.fetchOrderBook('ETH/TRY');
    // log.info('orderBook %o', orderBook);
  } catch (err) {
    log.error('error while checking for arbitrages\n%s', err.stack);
  }
};