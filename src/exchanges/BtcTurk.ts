import * as ccxt from 'ccxt';

export default class BtcTurk extends ccxt.btcturk {
  public async fetchOrderBook(symbol: string, limit?: number, params?: any) {
    await this.loadMarkets();
    return super.fetchOrderBook(symbol, limit, params);
  }
}
