import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { APP_SECRET } from '../utils'

const signup = async (_, args, { dataSources }, info) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await dataSources.prisma.createUser({ ...args, password })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}

const login = async (_, args, { dataSources }, info) => {
  const user = await dataSources.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}
module.exports = { signup, login }
