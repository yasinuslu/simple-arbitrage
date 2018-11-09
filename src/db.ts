import { Connection, createConnection } from 'typeorm';
import Arbitrage from './entity/Arbitrage';
import * as env from './env';

export let connection: Connection = null;

// eslint-disable-next-line import/prefer-default-export
export const setup = async () => {
  connection = await createConnection({
    type: 'postgres',
    url: env.dbUrl,
    entities: [Arbitrage],
    synchronize: true,
  });
};
