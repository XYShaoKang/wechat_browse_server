import { prismaObjectType } from 'nexus-prisma'
import { objectType, stringArg, inputObjectType, arg } from 'nexus'
import bcrypt from 'bcryptjs'

import { generateToken, saveFile } from '../utils'

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => {
    t.prismaFields([])

    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (_, args, { prisma }) => {
        if (!args.password) {
          throw new Error('密码不能为空')
        }
        const password = await bcrypt.hash(args.password, 10)
        const user = await prisma.createUser({ ...args, password })

        const token = generateToken({ userId: user.id })

        return { token, user }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg(),
        password: stringArg(),
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

        const token = generateToken({ userId: user.id })

        return { token, user }
      },
    })

    t.field('createWechatUsers', {
      type: 'WeChatUser',
      args: {
        data: arg({ type: 'WeChatUserCreateInput', required: true }),
      },
      resolve: async (_, args, { prisma }) => {
        let { data } = args
        let avatar

        if (data.avatar) {
          const { fileName: thumbnailImg } = await saveFile(
            data.avatar.thumbnailImg,
          )
          const { fileName: bigImg } = await saveFile(data.avatar.bigImg)

          avatar = {
            create: {
              thumbnailImg,
              bigImg,
            },
          }
        }

        return await prisma.createWeChatUser({ ...data, avatar })
      },
    })
  },
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token', { nullable: true })
    t.field('user', {
      type: 'User',
    })
  },
})

export const WeChatUserCreateInput = inputObjectType({
  name: 'WeChatUserCreateInput',
  definition(t) {
    t.string('username')
    t.string('alias')
    t.string('conRemark')
    t.string('nickname')
    t.field('avatar', { type: 'AvatarCreateInput' })
  },
})

export const AvatarCreateInput = inputObjectType({
  name: 'AvatarCreateInput',
  definition(t) {
    t.field('thumbnailImg', { type: 'Upload' })
    t.field('bigImg', { type: 'Upload' })
  },
})
