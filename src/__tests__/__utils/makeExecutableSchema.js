import { makePrismaSchema } from 'nexus-prisma'
import { applyMiddleware } from 'graphql-middleware'

import datamodelInfo from '../../../generated/nexus-prisma'
import * as allTypes from './../../resolvers'

import { permissions } from '../../permissions'

export default () => {
  const schema = makePrismaSchema({
    types: allTypes,

    prisma: {
      datamodelInfo,
      client: ctx => ctx.prisma,
    },

    outputs: {
      schema: '',
      typegen: '',
    },
  })
  return applyMiddleware(schema, permissions)
}
