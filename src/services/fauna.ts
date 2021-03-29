import { Client } from 'faunadb';

const fauna = new Client({
  secret: process.env.FAUNA_ROOT_KEY,
  domain: process.env.FAUNA_DOMAIN || 'localhost',
  port: Number(process.env.FAUNA_PORT) || 8443,
  scheme:
    process.env.FAUNA_SCHEME === 'http' || process.env.FAUNA_SCHEME === 'https'
      ? process.env.FAUNA_SCHEME
      : 'http',
});

export default fauna;
