import * as Queue from 'bull';
import * as env from './env';

// eslint-disable-next-line import/prefer-default-export
export const checkArbitrage = new Queue('checkArbitrage', env.queueRedisUrl);
