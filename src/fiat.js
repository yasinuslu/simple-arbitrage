const axios = require('axios');
const _ = require('lodash');

module.exports = class Fiat {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.doviz.com/list/C',
    });
  }

  async fetchTickers() {
    const res = await this.client.get('/');
    return _.chain(res.data.value)
      .map(obj => ({
        symbol: `${obj.key}/TRY`,
        buy: parseFloat(obj.alis),
        sell: parseFloat(obj.satis),
      }))
      .reduce((acc, obj) => {
        acc[obj.symbol] = obj;
        return acc;
      }, {})
      .value();
  }

  async fetchTicker(symbol = 'USD/TRY') {
    const tickers = await this.fetchTickers();
    return tickers[symbol];
  }
};
