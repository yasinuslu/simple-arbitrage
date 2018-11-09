import { createConnection } from 'typeorm';
import * as env from './env';

// eslint-disable-next-line import/prefer-default-export
export const setup = async () => {
  await createConnection({
    type: 'postgres',
    url: env.dbUrl,
  });
};
