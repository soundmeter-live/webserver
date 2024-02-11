import { gql } from 'graphql-tag';
export default gql`
  """
  One data point for volume level. Each point contains the time it was recorded.
  """
  type LevelPoint {
    "unique id"
    id: ID!
    "unix timestamp when this value was recorded"
    timeAt: Int!
    "audio level at this time"
    value: Float!

    "database timestamp: when this database entry was created/updated (NOT necessarily the same as when it was recorded)"
    timestamp: TS!
  }

  # -----------------

  type Query {
    "get all LevelPoints in the database"
    levelPoints: [LevelPoint!]!
    "get one LevelPoint by its ID"
    levelPoint(id: ID!): LevelPoint!
    "get only level points between a given timestamp and now"
    levelPointsAfterDate(after: Int!): [LevelPoint!]
    "get only level points recorded with the given range of timestamps"
    levelPointsBetweenDates(start: Int!, end: Int!): [LevelPoint!]
  }
  type Mutation {
    "create one new level point"
    levelPointCreate(point: LevelPointCreateInput!): LevelPoint!
    "create multiple new level points at once"
    levelPointCreateMultiple(points: [LevelPointCreateInput!]!): [LevelPoint]
    "select one level point by its ID and update one of its properties"
    levelPointUpdate(id: ID!, timeAt: Int, value: Float): LevelPoint!
    "delete one level point by its ID"
    levelPointDelete(id: ID!): LevelPoint!
    "purge all data prior to a certain date"
    levelPointDeleteAllBeforeDate(before: Int!): [LevelPoint]
  }

  "One singular level point input (note you do not need to supply id or timestamp values. The database will take care of that on its own."
  input LevelPointCreateInput {
    timeAt: Int!
    value: Float!
  }
`;
