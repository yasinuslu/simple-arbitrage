import { OrderBook } from 'ccxt';
import * as _ from 'lodash';

import { connection } from './db';
import { Arbitrage } from './entity';
import { Binance, BtcTurk, Fiat } from './exchanges';

const log = require('./log').default.child({ ns: 'checkArbitrage' });

const fiat = new Fiat();
const binance = new Binance();
const btcTurk = new BtcTurk();

const getAveragePrice = (orders: Array<[number, number]>, targetEthAmount) => {
  const result = _.chain(orders)
    .transform(
      (acc, [price, amount]) => {
        const remainingAmount = targetEthAmount - acc.totalAmount;
        const currentAmount = Math.min(remainingAmount, amount);

        acc.totalAmount += currentAmount;
        acc.totalValue += price * currentAmount;

        // stop if we reached targetEthAmount
        return !(acc.totalAmount >= targetEthAmount);
      },
      { totalValue: 0, totalAmount: 0 }
    )
    .value();

  return result.totalValue / result.totalAmount;
};

const didProfitChange = (arb: Arbitrage, prevArb: Arbitrage): boolean =>
  Math.abs(arb.profitRate - prevArb.profitRate) > arb.changeThreshold ||
  Math.abs(arb.returnRate - prevArb.returnRate) > arb.changeThreshold;

const isItProfitable = (arb: Arbitrage): boolean =>
  arb.profitRate >= arb.minProfitRate || arb.returnRate > arb.minReturnRate;

interface IRate {
  sell: number;
  buy: number;
}

class ArbitrageFinder {
  public usdTry: IRate;
  public btOrderBook: OrderBook;
  public binanceOrderBook: OrderBook;
  public usdTryAverage: number;

  public targetEthAmounts = [0.1, 0.5, 1, 2, 5];
  public changeThresholds = [0.1];
  public minProfitRates = [1.5];
  public minReturnRates = [-0.5];

  public async fetch() {
    const [usdTry, btOrderBook, binanceOrderBook] = await Promise.all([
      fiat.fetchTicker(),
      btcTurk.fetchOrderBook('ETH/TRY'),
      binance.fetchOrderBook('ETH/USDT'),
    ]);

    this.usdTry = usdTry;
    this.btOrderBook = btOrderBook;
    this.binanceOrderBook = binanceOrderBook;
    this.usdTryAverage = (usdTry.sell + usdTry.buy) / 2;
  }

  public async updateAll() {
    await this.fetch();

    const pairs = _.chain(this.targetEthAmounts)
      .map(targetEthAmount => ({ targetEthAmount }))
      .flatMap(obj =>
        this.changeThresholds.map(changeThreshold => ({
          ...obj,
          changeThreshold,
        }))
      )
      .flatMap(obj =>
        this.minProfitRates.map(minProfitRate => ({
          ...obj,
          minProfitRate,
        }))
      )
      .flatMap(obj =>
        this.minReturnRates.map(minReturnRate => ({
          ...obj,
          minReturnRate,
        }))
      )
      .value();

    await Promise.all(pairs.map(pair => this.update(pair)));
  }

  public async update({
    targetEthAmount,
    changeThreshold,
    minProfitRate,
    minReturnRate,
  }: {
    targetEthAmount: number;
    changeThreshold: number;
    minProfitRate: number;
    minReturnRate: number;
  }) {
    const arb = new Arbitrage();
    arb.startTime = new Date();
    arb.endTime = new Date();
    arb.btEthTrySell = getAveragePrice(this.btOrderBook.asks, targetEthAmount);
    arb.btEthTryBuy = getAveragePrice(this.btOrderBook.bids, targetEthAmount);
    arb.usdTrySell = this.usdTry.sell;
    arb.usdTryBuy = this.usdTry.buy;
    arb.btEthUsdSell = arb.btEthTrySell / this.usdTryAverage;
    arb.btEthUsdBuy = arb.btEthTryBuy / this.usdTryAverage;
    arb.binanceEthUsdSell = getAveragePrice(this.binanceOrderBook.asks, targetEthAmount);
    arb.binanceEthUsdBuy = getAveragePrice(this.binanceOrderBook.bids, targetEthAmount);
    arb.profitRate = (arb.binanceEthUsdBuy / arb.btEthUsdSell) * 100 - 100;
    arb.returnRate = (arb.btEthUsdBuy / arb.binanceEthUsdSell) * 100 - 100;
    arb.targetEthAmount = targetEthAmount;
    arb.changeThreshold = changeThreshold;
    arb.minProfitRate = minProfitRate;
    arb.minReturnRate = minReturnRate;

    if (!isItProfitable(arb)) {
      return;
    }

    const prevArb = await connection
      .getRepository(Arbitrage)
      .createQueryBuilder('arb')
      .where('arb.targetEthAmount = :targetEthAmount', arb)
      .andWhere('arb.changeThreshold = :changeThreshold', arb)
      .andWhere('arb.minProfitRate = :minProfitRate', arb)
      .andWhere('arb.minReturnRate = :minReturnRate', arb)
      .orderBy('arb.startTime', 'DESC')
      .getOne();

    if (!prevArb) {
      await connection.manager.save(arb);
      log.info('saved first arbitrage');
      return;
    }

    if (didProfitChange(arb, prevArb)) {
      prevArb.endTime = new Date();

      await connection.manager.save([arb, prevArb]);
    } else {
      arb.id = prevArb.id;
      arb.startTime = prevArb.startTime;

      await connection.manager.save(arb);
    }
  }
}

export default async job => {
  try {
    log.info('checking');
    const finder = new ArbitrageFinder();
    await finder.updateAll();

    log.info('completed successfully');
  } catch (err) {
    log.error('error while checking for arbitrages\n%s', err.stack);
  }
};
