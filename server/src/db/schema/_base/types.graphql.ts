import gql from 'graphql-tag';
export default gql`
  type TS {
    created: Int!
    updated: Int!
  }

  """
  epoch timestamp in milliseconds. can be passed as a string or a number, although number values may fail depending on their size.
  """
  scalar DateType
`;
