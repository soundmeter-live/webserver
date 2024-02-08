import { gql } from 'graphql-tag';
export default gql`
  type LevelPoint {
    id: ID!
    value: Float!
    timeAt: Int

    timestamp: TS!
  }

  # -----------------

  type Query {
    levelPoints: [LevelPoint!]
  }
  type Mutation {
    levelPointCreate(point: LevelPointCreateInput!): LevelPoint!
    levelPointCreateMultiple(points: [LevelPointCreateInput!]!): [LevelPoint]
  }

  input LevelPointCreateInput {
    value: Float!
    timeAt: Int!
  }
`;
