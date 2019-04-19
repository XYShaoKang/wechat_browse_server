import { stringArg, mutationField } from 'nexus'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../utils'

export const Login = mutationField('login', {
  type: 'AuthPayload',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  resolve: async (_, args, { prisma }) => {
    const user = await prisma.user({ email: args.email })

    if (!user) {
      throw new Error('No such user found')
    }
    const valid = await bcrypt.compare(args.password || '', user.password)

    if (!valid) {
      throw new Error('Invalid password')
    }

    const weChats = await prisma.user({ id: user.id }).weChat()
    const weChatId = weChats.length > 0 ? weChats[0].id : undefined

    const token = generateToken({ userId: user.id, weChatId })

    return { token, user }
  },
})
