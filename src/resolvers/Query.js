import { prismaObjectType } from 'nexus-prisma'

export const Query = prismaObjectType({
  name: 'Query',
  definition: t =>
    t.prismaFields(['users', 'weChatUsers', 'chatRooms', 'messages']),
})
export const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields(['id', 'name', 'email', 'weChat'])
  },
})
