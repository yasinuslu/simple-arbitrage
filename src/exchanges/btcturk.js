import ccxt from 'ccxt';

ccxt.btcturk = class btcturk extends ccxt.btcturk {
  async fetchOrderBook(...args) {
    await this.loadMarkets();
    return super.fetchOrderBook(...args);
  }
};

export default ccxt.btcturk;
