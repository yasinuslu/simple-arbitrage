const ccxt = require('ccxt');

ccxt.btcturk = class btcturk extends ccxt.btcturk {
  async fetchOrderBook(...args) {
    await this.loadMarkets();
    return super.fetchOrderBook(...args);
  }
};

module.exports = ccxt.btcturk;
