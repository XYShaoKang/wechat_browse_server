import { prismaObjectType } from 'nexus-prisma'

export * from './CreateWeChatUsers'
export * from './CreateChatRooms'
export * from './Login'
export * from './Signup'

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => {
    t.prismaFields([])
  },
})
