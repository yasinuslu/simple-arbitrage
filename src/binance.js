const ccxt = require('ccxt');

ccxt.binance = class binance extends ccxt.binance {};

module.exports = ccxt.binance;
