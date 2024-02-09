import { err, handle as h } from '@/db/utilities';
import { GraphQLError } from 'graphql';
import type {
  MutationResolvers,
  QueryResolvers,
} from '@/db/__types/graphql-types';
import { QueryOp } from '@/db/lib/Model';

export const getLevelPoints = h<QueryResolvers['levelPoints']>(
  ({ sources }) => {
    return sources.levelPoint.getAll();
  }
);

export const getLevelPoint = h<QueryResolvers['levelPoint']>(
  ({ sources, args: { id } }) => {
    return sources.levelPoint.get(id);
  }
);

export const getLevelPointsAfterDate = h<
  QueryResolvers['levelPointsAfterDate']
>(async ({ sources, args: { after } }) => {
  return sources.levelPoint.query('timeAt', QueryOp.GTE, after);
});

export const getLevelPointsBetweenDates = h<
  QueryResolvers['levelPointsBetweenDates']
>(({ sources, args: { start, end } }) => {
  return sources.levelPoint.query('timeAt', QueryOp.BETWEEN, start, end);
});

// -----------

export const levelPointCreate = h<MutationResolvers['levelPointCreate']>(
  ({ sources, args: { point } }) => {
    return sources.levelPoint.create(point);
  }
);

export const levelPointCreateMultiple = h<
  MutationResolvers['levelPointCreateMultiple']
>(({ sources, args: { points } }) => {
  return sources.levelPoint.createMultiple(points);
});

export const levelPointUpdate = h<MutationResolvers['levelPointUpdate']>(
  async ({ sources, args: { id, ...updates } }) => {
    const op = await sources.levelPoint.get(id);
    if (!op) throw err('ITEM_NOT_FOUND');

    return sources.levelPoint.update(id, updates);
  }
);

export const levelPointDelete = h<MutationResolvers['levelPointDelete']>(
  async ({ sources, args: { id } }) => {
    const op = await sources.levelPoint.get(id);
    if (!op) throw err('ITEM_NOT_FOUND');

    return sources.levelPoint.delete(id);
  }
);

export const levelPointDeleteAllBeforeDate = h<
  MutationResolvers['levelPointDeleteAllBeforeDate']
>(async ({ sources, args: { before } }) => {
  const matches = await sources.levelPoint.query('timeAt', QueryOp.LT, before);
  const ids = matches.map(({ id }) => id);

  await sources.levelPoint.deleteMultiple(ids, /* output: */ false);

  return matches;
});
