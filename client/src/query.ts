import {
  QueryClient,
  UndefinedInitialDataOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios';
import request from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { api } from '@/util/dev';

export const queryClient = new QueryClient();

type QueryOpts = Partial<UndefinedInitialDataOptions>;

export const useApiQuery = (
  path: string,
  params?: Record<string, unknown> | null,
  opts?: QueryOpts,
) =>
  useQuery({
    queryKey: [path, params],
    queryFn: async () => {
      const resp = await axios.get(api + path, {
        params: params ?? undefined,
      });
      return resp.data;
    },
    ...opts,
  });

export const useGraphQuery = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables, opts]: TVariables extends Record<string, never>
    ? [(null | undefined)?, QueryOpts?]
    : [TVariables, QueryOpts?]
) =>
  useQuery({
    queryKey: [(document.definitions[0] as any).name.value, variables],
    queryFn: async () =>
      request(api + '/gql', document, variables ?? undefined),
    ...opts,
  }) as UseQueryResult<TResult>;
