import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'

import { prisma } from '../generated/prisma-client'
import { getUserId } from './utils'

import typeDefs from './schema.graphql'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'

const resolvers = {
  Query,
  Mutation,
}

const dataSources = () => ({
  prisma,
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ ctx }) => {
    const authorization = ctx.request.header.authorization || ''
    let currentUser = null
    try {
      if (authorization) {
        const userId = getUserId(authorization)
        currentUser = await prisma.user({ id: userId })
      }
    } catch (e) {
      console.warn(`Unable to authenticate using auth token: ${authorization}`)
    }
    return { currentUser }
  },
  dataSources,
})

const app = new Koa()
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
)
