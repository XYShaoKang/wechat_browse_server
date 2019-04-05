import { prisma } from '../generated/prisma-client'
import bcrypt from 'bcryptjs'

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWD, 10)
  await prisma.createUser({
    email: process.env.ADMIN_EMAIL,
    name: process.env.ADMIN_NAME,
    password,
  })
}

// eslint-disable-next-line no-console
main().catch(e => console.error(e))
