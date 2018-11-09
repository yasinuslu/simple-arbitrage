import ccxt from 'ccxt';

ccxt.binance = class binance extends ccxt.binance {};

export default ccxt.binance;
