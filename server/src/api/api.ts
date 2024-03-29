import express from 'express';
import { z } from 'zod';

import { graph } from '@/db/graph';
import { graphql as gql } from '@/db/__types_client';

import { validate } from '@/util/validate';

const r = express.Router();

r.post('/add-points', async (req, res) => {
  const { error, data: input } = validate(
    req.body,
    z.object({
      currentTime: z.number().int().optional(),
      points: z.array(
        z.object({
          timeAt: z.number().int(),
          value: z.number(),
        })
      ),
    })
  );
  if (error) return res.err(400, error);

  // correct times if needed
  let points = input!.points;
  if (input!.currentTime) {
    // const offset = Math.floor(Date.now() / 1000) - input!.currentTime;
    const offset = Date.now() - input!.currentTime;
    points = points.map((p) => ({
      ...p,
      timeAt: p.timeAt + offset,
    }));
  }

  // upload
  const { errors, data } = await graph(
    gql(/* GraphQL */ `
      mutation APILevelPointCreateMultiple($points: [LevelPointCreateInput!]!) {
        levelPointCreateMultiple(points: $points) {
          id
          timeAt
          value
        }
      }
    `),
    {
      points: points.map((p) => ({
        ...p,
        timeAt: '' + p.timeAt,
      })),
    }
  );
  if (errors || !data) return res.err(500, 'SERVER_ERROR', errors);

  // return data
  res.json({ points: data.levelPointCreateMultiple });
});

r.get('/points', async (_, res) => {
  const { errors, data } = await graph(
    gql(/* GraphQL */ `
      query APIGetLevelPoints {
        levelPoints {
          id
          timeAt
          value
        }
      }
    `)
  );
  if (errors || !data) return res.err(500, 'SERVER_ERROR', errors);

  const points = data.levelPoints;

  res.json({ points });
});

r.use((_, res) => res.err(404, 'API_ROUTE_NOT_FOUND'));

export default r;
