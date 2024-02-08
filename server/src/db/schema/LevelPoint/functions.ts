import { MutationResolvers, QueryResolvers } from '@/db/__types/graphql-types';
import { err, handle as h } from '@/db/utilities';

export const getLevelPoints = h<QueryResolvers['levelPoints']>(
  ({ sources }) => {
    return sources.levelPoint.getAll();
  }
);

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
