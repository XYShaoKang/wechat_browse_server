import { Prisma, graphqlTestCall } from '../__utils'
import { CreateMessages } from '../__types'
import { messageData } from '../__variables'

describe('Mutation', () => {
  /** @type {Prisma} */
  let prisma
  beforeEach(() => {
    prisma = new Prisma()
  })
  it('create Messages', async () => {
    await graphqlTestCall({
      query: CreateMessages,
      variables: messageData,
      context: {
        prisma,
        currentUser: { id: '0' },
        currentWeChat: { id: '0' },
      },
    })

    expect(prisma.updateWeChat).toHaveBeenCalled()
    expect(prisma.createMessage).toHaveBeenCalled()
    expect(prisma.connectWeChatUser).toHaveBeenCalled()
    expect(prisma.connectChatRoom).toHaveBeenCalled()
    expect(prisma.db.messages).toMatchSnapshot()
  })
  it('create Messages Fail No WeChat', async () => {
    const result = await graphqlTestCall({
      query: CreateMessages,
      variables: messageData,
      context: {
        prisma,
        currentUser: { id: '0' },
      },
    })

    const message = result.errors && result.errors[0].message
    expect(message).toBe('No WeChat')
    expect(result).toMatchSnapshot()
  })
})
