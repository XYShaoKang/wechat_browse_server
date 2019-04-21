import { Prisma, WeChat, User } from '../generated/prisma-client'

export interface Context {
  prisma: Prisma
  currentUser: User
  currentWeChat: WeChat
}
