import { GraphQLDateTime as DateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import Query from './Query'
import Mutation from './Mutation'

export default {
  Query,
  Mutation,
  DateTime,
  JSON: GraphQLJSON,
}
