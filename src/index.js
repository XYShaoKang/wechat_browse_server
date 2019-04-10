import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import serve from 'koa-static'
import { applyMiddleware } from 'graphql-middleware'

import { prisma } from '../generated/prisma-client'
import { getUserId, STATIC_PATH } from './utils'
import { permissions } from './permissions'

import { schema } from './schema'

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: async ({ ctx }) => {
    const authorization = ctx.request.header.authorization || ''
    let currentUser = null
    try {
      if (authorization) {
        const userId = getUserId(authorization)
        currentUser = await prisma.user({ id: userId })
      }
    } catch (e) {
      // console.warn(`Unable to authenticate using auth token: ${authorization}`)
    }
    return { currentUser, prisma }
  },
})

const app = new Koa()

server.applyMiddleware({ app })

app.use(serve(STATIC_PATH))

app.listen({ port: 4000 }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
)
