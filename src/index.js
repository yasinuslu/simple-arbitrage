import './exchanges';

import redis from './redis';
import * as queue from './queue';
import checkArbitrage from './checkArbitrage';

queue.checkArbitrage.process(checkArbitrage);

const keepAlive = () => {
  // eslint-disable-next-line no-underscore-dangle
  const _keepAlive = () => {};
  setInterval(_keepAlive, 10000);
};

(async () => {
  await redis.queue.flushdb();
  await new Promise(resolve => setTimeout(resolve, 2000));

  queue.checkArbitrage.add({}, { repeat: { every: 5000 } });

  keepAlive();
})();
