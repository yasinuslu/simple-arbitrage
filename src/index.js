const queue = require('./queue');
const checkArbitrage = require('./checkArbitrage');

queue.checkArbitrage.process(checkArbitrage);

const keepAlive = () => {
  // eslint-disable-next-line no-underscore-dangle
  const _keepAlive = () => {};
  setInterval(_keepAlive, 10000);
};

(async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  queue.checkArbitrage.add({}, { repeat: { every: 1000 } });

  keepAlive();
})();
