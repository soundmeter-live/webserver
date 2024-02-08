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
