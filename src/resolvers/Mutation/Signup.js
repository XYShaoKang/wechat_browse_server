import { stringArg, mutationField } from 'nexus'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../utils'

export const Signup = mutationField('signup', {
  type: 'AuthPayload',
  args: {
    name: stringArg({ required: true }),
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: async (_, args, { prisma }) => {
    if (!args.password) {
      throw new Error('密码不能为空')
    }
    const password = await bcrypt.hash(args.password, 10)
    const tempUser = await prisma.user({ email: args.email })

    if (tempUser) {
      throw new Error('Email Already Exists')
    }
    const user = await prisma.createUser({ ...args, password })

    const weChats = await prisma.user({ id: user.id }).weChat()
    const weChatId = weChats.length > 0 ? weChats[0].id : undefined

    const token = generateToken({ userId: user.id, weChatId })

    return { token, user }
  },
})
