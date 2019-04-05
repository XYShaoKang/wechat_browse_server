const { prisma } = require('../generated/prisma-client')

async function main() {
  await prisma.createUser({
    email: process.env.ADMIN_EMAIL,
    name: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASSWD,
  })
}

// eslint-disable-next-line no-console
main().catch(e => console.error(e))
