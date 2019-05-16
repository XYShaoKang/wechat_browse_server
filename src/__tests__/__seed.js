import { prisma } from '../../generated/prisma-client'

export async function weChatUserSeed() {
  const weChatUsers = [{ username: 'a' }, { username: 'b' }, { username: 'c' }]
  await Promise.all(weChatUsers.map(prisma.createWeChatUser))
  // prisma.createWeChatUser({})
}

export async function chatRoomSeed() {
  const chatRooms = [
    {
      username: 'b@chatroom',
      owner: { connect: { username: 'a' } },
      memberList: { connect: [{ username: 'a' }, { username: 'b' }] },
      modifyTime: new Date('2019-04-24T16:51:14.743Z'),
    },
  ]
  await Promise.all(chatRooms.map(prisma.createChatRoom))
}
