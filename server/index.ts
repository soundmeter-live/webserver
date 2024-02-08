import serverless from 'serverless-http';
import 'graphql-import-node';

import express from 'express';
import cors from 'cors';

import { expressErr } from '@/util/err';
import { graphHTTP } from '@/db/graph';
import api from '@/api/api';

if (process.env.IS_OFFLINE) {
  import('dotenv/config');
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(expressErr);

// ROUTER

app.get('/', (_, res) => res.json({ data: 'hello world' }));

app.use('/api', api);

app.use('/gql', graphHTTP);

app.use((_, res) => res.err(404, 'NOT_FOUND'));

export const handler = serverless(app);
