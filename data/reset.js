import { prisma } from '../generated/prisma-client'

async function main() {
  await prisma.deleteManyWeChatUsers()
  await prisma.deleteManyAvatars()
  await prisma.deleteManyFileIndexes()
}

// eslint-disable-next-line no-console
main().catch(e => console.error(e))
