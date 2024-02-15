import { _BaseModule } from './__types/module-types';

import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const resolvers: _BaseModule.Resolvers = {
  DateType: new GraphQLScalarType({
    name: 'DateType',

    /** convert timestamp to string for outputting */
    serialize(value) {
      const date = new Date(value as number);
      if (Number.isNaN(date.getTime()))
        throw new TypeError('Field error: value is an invalid Date');
      return date.getTime().toString();
    },

    /** parse value (string) into number form */
    parseValue(value) {
      if (typeof value !== 'string')
        throw new GraphQLError(
          'Field error: timestamp value passed must be a string.'
        );
      const date = new Date(parseInt(value));
      if (Number.isNaN(date.getTime()))
        throw new GraphQLError('Field error: value is not a valid timestamp');

      return date.getTime();
    },

    /** parse input (string) timestamp into number for db */
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING)
        throw new GraphQLError(
          'Query error: Can only parse strings to dates but got a: ' + ast.kind
        );

      const result = new Date(parseInt(ast.value));
      if (Number.isNaN(result.getTime()))
        throw new GraphQLError('Query error: Invalid Date');

      if (ast.value !== result.getTime().toString())
        throw new GraphQLError(
          'Query error: Invalid date format. Only accepts millisecond epoch timestamps.'
        );

      return result.getTime();
    },
  }),
};

export default resolvers;
