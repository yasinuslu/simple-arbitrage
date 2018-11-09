import * as ccxt from 'ccxt';

import { connection } from './db';
import { Arbitrage } from './entity';
import { Binance, BtcTurk, Fiat } from './exchanges';

const log = require('./log').default.child({ ns: 'checkArbitrage' });

export default async job => {
  try {
    const fiat = new Fiat();
    const binance = new Binance();
    // const btcTurk = new BtcTurk();
    // const arb = new Arbitrage();
    // arb.time = new Date();
    // await connection.manager.save(arb);
    log.info('saved');
  } catch (err) {
    log.error('error while checking for arbitrages\n%s', err.stack);
  }
};
