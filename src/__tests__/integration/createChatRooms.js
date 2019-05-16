import { Prisma, graphqlTestCall } from '../__utils'
import { CreateChatRooms } from '../__types'
import { chatRoomData } from '../__variables'

describe.only('Mutation', () => {
  /** @type {Prisma} */
  let prisma
  beforeEach(() => {
    prisma = new Prisma()
  })
  it('create ChatRoom', async () => {
    const result = await graphqlTestCall({
      query: CreateChatRooms,
      variables: chatRoomData,
      context: {
        prisma,
        currentUser: { id: '0' },
        currentWeChat: { id: '0' },
      },
    })

    const id = result.data && result.data.CreateChatRooms.id

    expect(id).toBe('0')
    expect(prisma.updateWeChat.mock.calls.length).toBe(1)
    expect(result).toMatchSnapshot()
    expect(prisma.db.chatRooms).toMatchSnapshot()
    expect(prisma.db.avatars).toMatchSnapshot()
  })
  it('create WeChatUser Fail No WeChat', async () => {
    const result = await graphqlTestCall({
      query: CreateChatRooms,
      variables: chatRoomData,
      context: { prisma, currentUser: { id: '0' } },
    })
    const message = result.errors && result.errors[0].message

    expect(message).toBe('No WeChat')
    expect(result).toMatchSnapshot()
  })
})
