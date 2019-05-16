import { prisma } from '../generated/prisma-client'
import bcrypt from 'bcryptjs'

async function main() {
  const {
    ADMIN_EMAIL: email = '',
    ADMIN_PASSWD: ADMIN_PASSWD = '',
    ADMIN_NAME: name = '',
  } = process.env
  const password = await bcrypt.hash(ADMIN_PASSWD, 10)
  await prisma.createUser({
    email,
    name,
    password,
    weChat: {
      create: {
        weChatOwner: {
          create: {
            username: 'demo',
            alias: 'demo',
          },
        },
      },
    },
  })
  await prisma.createFileGroup({ name: 'cacheFiles' })
}

// eslint-disable-next-line no-console
main().catch(e => console.error(e))
