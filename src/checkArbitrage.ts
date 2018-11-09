import { OrderBook } from 'ccxt';
import * as _ from 'lodash';

import { connection } from './db';
import { Arbitrage } from './entity';
import { Binance, BtcTurk, Fiat } from './exchanges';

const log = require('./log').default.child({ ns: 'checkArbitrage' });

const fiat = new Fiat();
const binance = new Binance();
const btcTurk = new BtcTurk();

const BUY_TARGET_ETH = 1;

const getAveragePrice = (orders: Array<[number, number]>, targetAmount = BUY_TARGET_ETH) => {
  const result = _.chain(orders)
    .transform(
      (acc, [price, amount]) => {
        const remainingAmount = targetAmount - acc.totalAmount;
        const currentAmount = Math.min(remainingAmount, amount);

        acc.totalAmount += currentAmount;
        acc.totalValue += price * currentAmount;

        // stop if we reached targetAmount
        return !(acc.totalAmount >= targetAmount);
      },
      { totalValue: 0, totalAmount: 0 }
    )
    .value();

  return result.totalValue / result.totalAmount;
};

const isProfitChanged = (arb: Arbitrage, prevArb: Arbitrage): boolean =>
  Math.abs(arb.profitRate - prevArb.profitRate) > 0.1 ||
  Math.abs(arb.returnRate - prevArb.returnRate) > 0.1;

export default async job => {
  try {
    log.info('checking');
    const [usdTry, btOrderBook, binanceOrderbook] = await Promise.all([
      fiat.fetchTicker(),
      btcTurk.fetchOrderBook('ETH/TRY'),
      binance.fetchOrderBook('ETH/USDT'),
    ]);

    const usdTryAverage = (usdTry.sell + usdTry.buy) / 2;

    const arb = new Arbitrage();
    arb.startTime = new Date();
    arb.endTime = new Date();
    arb.btEthTrySell = getAveragePrice(btOrderBook.asks);
    arb.btEthTryBuy = getAveragePrice(btOrderBook.bids);
    arb.usdTrySell = usdTry.sell;
    arb.usdTryBuy = usdTry.buy;
    arb.btEthUsdSell = arb.btEthTrySell / usdTryAverage;
    arb.btEthUsdBuy = arb.btEthTryBuy / usdTryAverage;
    arb.binanceEthUsdSell = getAveragePrice(binanceOrderbook.asks);
    arb.binanceEthUsdBuy = getAveragePrice(binanceOrderbook.bids);
    arb.profitRate = (arb.binanceEthUsdBuy / arb.btEthUsdSell) * 100 - 100;
    arb.returnRate = (arb.btEthUsdBuy / arb.binanceEthUsdSell) * 100 - 100;
    arb.targetEthAmount = BUY_TARGET_ETH;

    const prevArb = await connection
      .getRepository(Arbitrage)
      .createQueryBuilder('arb')
      .orderBy('arb.startTime', 'DESC')
      .getOne();

    if (!prevArb) {
      await connection.manager.save(arb);
      log.info('saved first arbitrage');
      return;
    }

    if (isProfitChanged(arb, prevArb)) {
      prevArb.endTime = new Date();

      await connection.manager.save([arb, prevArb]);
      // await Promise.all([connection.manager.save(arb), connection.manager.save(prevArb)]);
    } else {
      arb.id = prevArb.id;
      arb.startTime = prevArb.startTime;

      await connection.manager.save(arb);
    }

    log.info('completed successfully');
  } catch (err) {
    log.error('error while checking for arbitrages\n%s', err.stack);
  }
};
