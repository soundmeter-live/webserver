import { graphql as gql } from './__types';

export const GET_LEVEL_POINTS_AFTER_DATE = gql(/* GraphQL */ `
  query LevelPointsAfterDate($after: DateType!) {
    levelPointsAfterDate(after: $after) {
      id
      timeAt
      value
    }
  }
`);

export const GET_LEVEL_POINTS = gql(/* GraphQL */ `
  query LevelPoints {
    levelPoints {
      id
      timeAt
      value
    }
  }
`);
