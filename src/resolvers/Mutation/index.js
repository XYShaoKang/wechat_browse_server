import { prismaObjectType } from 'nexus-prisma'

export * from './Login'
export * from './Signup'
export * from './CreateWeChatUsers'
export * from './CreateChatRooms'
export * from './CreateMessages'

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => {
    t.prismaFields([])
  },
})
