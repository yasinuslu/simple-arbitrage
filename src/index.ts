import './exchanges';

import checkArbitrage from './checkArbitrage';
import * as db from './db';
import * as queue from './queue';
import redis from './redis';

queue.checkArbitrage.process(checkArbitrage);

(async () => {
  await Promise.all([
    db.setup(),
    redis.queue.flushdb(),
    new Promise(resolve => setTimeout(resolve, 2000)),
  ]);

  queue.checkArbitrage.add({}, { repeat: { every: 5000 } });
})();
