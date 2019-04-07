import bcrypt from 'bcryptjs'

import { generateToken, saveFile } from '../utils'

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
const addWechatUsers = async (
  _,
  { weChatUser: { username, alias, conRemark, nickname } },
  { dataSources },
) => {
  const weChatUser = await dataSources.prisma.createWeChatUser({
    username,
    alias,
    conRemark,
    nickname,
  })

  return [weChatUser]
}
const addAvatar = async (_, { file }, { dataSources }) => {
  const { stream, mimetype, encoding } = await file
  const filename = await saveFile(stream, mimetype)
  // console.log(filename, mimetype, encoding)

  return {
    filename,
    mimetype,
    encoding,
  }
}

export default { signup, login, addWechatUsers, addAvatar }
