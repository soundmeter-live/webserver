import { GraphQLError } from 'graphql';

import type { DBType } from './lib/Model';
import type { Resolver, ResolverFn } from '@/db/__types/graphql-types';
import type { Maybe } from 'graphql/jsutils/Maybe';
import type { ResolverContextType } from './graph';

type Scope = Record<string, boolean>;
export type CtxExtended<T extends ResolverFn<any, any, any, any>> =
  Parameters<T>[2] & {
    parent: Parameters<T>[0];
    args: Parameters<T>[1];
  };

export const err = (code: string, msg?: string, log?: unknown) => {
  msg = msg || `Error code: ${code}`;
  if (log) console.log(log);
  return new GraphQLError(msg, { extensions: { code } });
};

// scope checking functions
export const scopeError = () => err('NEED_PERMISSION');
export const scopeDiff = (scope: Scope, required: string) => {
  if (!scope) return false;
  const list = required.match(/[\w_]+/g);
  if (!list?.length) return false;
  for (const it of list) {
    if (scope[it]) return true;
  }
  return false;
};

/**
 * middleware scope checker: pass in the required scope to be checked against the current context.
 *
 * @param scope a string of allowed scopes, separated by any character(s)
 * @returns a checker function that returns undefined if valid, or throws an error if invalid
 */
export const scoped =
  (scope: string) =>
  (
    ctx: CtxExtended<ResolverFn<unknown, unknown, ResolverContextType, unknown>>
  ): undefined => {
    if (!scopeDiff(ctx.scope, scope)) throw scopeError();
  };

/**
 * template function for running callbacks over singular context object. pass as many callbacks as you'd like as arguments, and they will each receive the context object to work with. returning undefined will continue to the next callback function without exiting.
 *
 * @param callbacks [callback(ctx)]
 * @returns the first value you return from any callback
 */
export const handle = <T0 extends Resolver<any, any, any, any> | undefined>(
  ...callbacks: ((
    ctx: CtxExtended<Extract<T0, Function>>
  ) => Maybe<ReturnType<Extract<T0, Function>>>)[]
) => {
  type T = Extract<T0, Function>;

  return (async (
    parent: Parameters<T>[0],
    args: Parameters<T>[1],
    ctx: Parameters<T>[2]
  ) => {
    const extendedCtx = { ...ctx, parent, args };

    let out;
    for (const it of callbacks) {
      out = it(extendedCtx);
      if (typeof out !== 'undefined') break;
    }

    return out;
  }) as unknown as T;
};

/** resolves timestamps from db form to graphql form. */
export const timestamp = ({
  tcreated: created,
  tupdated: updated,
}: Partial<DBType<unknown>>) =>
  ({
    created,
    updated,
  } as { created: number; updated: number });
