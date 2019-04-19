import path from 'path'
import { makePrismaSchema } from 'nexus-prisma'

import { prisma } from '../generated/prisma-client'
import datamodelInfo from '../generated/nexus-prisma'
import * as allTypes from './resolvers'

export const schema = makePrismaSchema({
  types: allTypes,

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.js'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './types.d.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
    // debug: true,
  },
})
