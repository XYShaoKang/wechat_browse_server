import { graphql } from 'graphql'

import schema from './makeExecutableSchema'

/**
 * @param {{query:string, variables?:object, context?:object}} arg1
 */
export const graphqlTestCall = async ({ query, variables, context }) => {
  return graphql(schema(), query, undefined, context, variables)
}
