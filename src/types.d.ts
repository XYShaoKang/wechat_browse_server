import { Prisma, WeChat } from '../generated/prisma-client'

export interface Context {
  prisma: Prisma
  currentWeChat: WeChat
}
