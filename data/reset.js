import { prisma } from '../generated/prisma-client'

export async function reset() {
  await prisma.deleteManyUsers({ email_not: process.env.ADMIN_EMAIL })
  await prisma.deleteManyWeChatUsers({ username_not: 'demo' })
  await prisma.deleteManyChatRooms()
  await prisma.deleteManyAvatars()
  await prisma.deleteManyFileIndexes()
  await prisma.deleteManyMessages()
}
if (process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line no-console
  reset().catch(e => console.error(e))
}
