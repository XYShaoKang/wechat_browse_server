import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import serve from 'koa-static'
import { applyMiddleware } from 'graphql-middleware'

import { prisma } from '../generated/prisma-client'
import { getUserId, STATIC_PATH } from './utils'
import { permissions } from './permissions'

import { schema } from './schema'

// @ts-ignore
export const context = async ({ ctx }) => {
  const authorization = ctx.request.header.authorization || ''
  let currentUser = null
  let currentWeChat = null
  try {
    if (authorization) {
      const { userId, weChatId } = getUserId(authorization)
      currentUser = await prisma.user({ id: userId })
      currentWeChat = await prisma.weChat({ id: weChatId })
    }
  } catch (e) {
    // console.warn(`Unable to authenticate using auth token: ${authorization}`)
  }
  return { currentUser, currentWeChat, prisma }
}

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context,
})

const app = new Koa()

// 设置请求时的 json 大小限制,默认为 1mb,当批量导入数据时会报错`request entity too large`
const bodyParserConfig = {
  jsonLimit: '10mb',
}

server.applyMiddleware({
  app,
  bodyParserConfig,
})

app.use(serve(STATIC_PATH))
if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: 4000 }, () =>
    // eslint-disable-next-line no-console
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`,
    ),
  )
}
