import * as Redis from 'ioredis';
import * as env from './env';

// eslint-disable-next-line import/prefer-default-export
const queue = new Redis(env.queueRedisUrl, {
  enableReadyCheck: true,
});

export default { queue };
