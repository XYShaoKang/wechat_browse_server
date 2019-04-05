import bcrypt from 'bcryptjs'

import { generateToken } from '../utils'

const signup = async (_, args, { dataSources }) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await dataSources.prisma.createUser({ ...args, password })

  const token = generateToken({ userId: user.id })

  return { token, user }
}

const login = async (_, args, { dataSources }) => {
  const user = await dataSources.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = generateToken({ userId: user.id })

  return { token, user }
}

export default { signup, login }
