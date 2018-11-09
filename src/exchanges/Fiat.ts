import axios from 'axios';
import _ from 'lodash';

export default class Fiat {
  public client: any;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.doviz.com/list/C',
    });
  }

  public async fetchTickers() {
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

  public async fetchTicker(symbol = 'USD/TRY') {
    const tickers = await this.fetchTickers();
    return tickers[symbol];
  }
}
