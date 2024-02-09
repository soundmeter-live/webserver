/* eslint-disable react-hooks/rules-of-hooks */
import { createYoga } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { createApplication } from 'graphql-modules';

import type { ExecutionResult, DocumentNode } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';

// import schema
import { modules as modulesList, sources } from './schema/modules';

// define GraphQL Application
const modules = createApplication({
  modules: modulesList,
});
const context = (scope: Record<string, boolean>, userId?: string) => ({
  sources: sources(),
  scope,
  userId: userId || null,
});
export type ResolverContextType = ReturnType<typeof context>;
type GraphResponseType<T> = PromiseOrValue<
  ExecutionResult<T, { code?: string }>
>;

// build local and external endpoints (graph and graphHTTP)

const execute = modules.createExecution();
const graphUntyped = (
  document: DocumentNode,
  variableValues?: { [key: string]: unknown }
) =>
  execute({
    schema: modules.schema,
    document,
    variableValues,
    contextValue: context({ ADMIN: true, __SECURE: true }),
  });

export const graph = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) =>
  graphUntyped(document, variables || undefined) as GraphResponseType<TResult>;

export const graphHTTP = createYoga({
  plugins: [useGraphQLModules(modules)],
  graphqlEndpoint: '/gql',
  graphiql: false,
  fetchAPI: { Response },

  context: async (ctx) => {
    // context

    return context({ ADMIN: true });

    // return [null, { status: 401, statusText: 'Unauthorized' }];

    // return context(scope, user.id)
  },
});
