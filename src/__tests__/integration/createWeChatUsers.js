import { Prisma, graphqlTestCall } from '../__utils'
import { CreateWeChatUsers } from '../__types'
import { weChatUserData } from '../__variables'

describe('Mutation', () => {
  /** @type {Prisma} */
  let prisma
  beforeEach(() => {
    prisma = new Prisma()
  })
  it('create WeChatUser', async () => {
    const result = await graphqlTestCall({
      query: CreateWeChatUsers,
      variables: weChatUserData,
      context: {
        prisma,
        currentUser: { id: '0' },
        currentWeChat: { id: '0' },
      },
    })
    const id = result.data && result.data.CreateWeChatUsers.id

    expect(id).toBe('0')
    expect(prisma.updateWeChat).toHaveBeenCalled()
    expect(prisma.createWeChatUser).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
    expect(prisma.db.weChatUsers).toMatchSnapshot()
    expect(prisma.db.avatars).toMatchSnapshot()
  })
  it('create WeChatUser Fail No WeChat', async () => {
    const result = await graphqlTestCall({
      query: CreateWeChatUsers,
      variables: weChatUserData,
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
