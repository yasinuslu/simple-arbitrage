import './exchanges';

import redis from './redis';
import * as queue from './queue';
import checkArbitrage from './checkArbitrage';
import * as db from './db';

queue.checkArbitrage.process(checkArbitrage);

const keepAlive = () => {
  // eslint-disable-next-line no-underscore-dangle
  const _keepAlive = () => {};
  setInterval(_keepAlive, 10000);
};

(async () => {
  await Promise.all([
    db.setup(),
    redis.queue.flushdb(),
    new Promise(resolve => setTimeout(resolve, 2000)),
  ]);

  queue.checkArbitrage.add({}, { repeat: { every: 5000 } });

  keepAlive();
})();
