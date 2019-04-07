import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import serve from 'koa-static'

import { prisma } from '../generated/prisma-client'
import { getUserId } from './utils'

import typeDefs from './schema.graphql'
import resolvers from './resolvers'
import RequireAuthDirective from './directives/requireAuthDirective'
import { STATIC_PATH } from './utils'

const dataSources = () => ({
  prisma,
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    requireAuth: RequireAuthDirective,
  },
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
    return { currentUser }
  },
  dataSources,
})

const app = new Koa()
server.applyMiddleware({ app })

app.use(serve(STATIC_PATH))

app.listen({ port: 4000 }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
)
