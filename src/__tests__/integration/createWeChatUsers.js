//#region mock

jest.mock('../../utils/download')
import * as downloadManageUtils from '../../utils/downloadManage'

let id = 0
const downloadManage = jest.fn(() => {
  return of(++id + '')
})

jest
  .spyOn(downloadManageUtils, 'downloadManage')
  .mockImplementation(downloadManage)

//#endregion

import { of } from 'rxjs'

import { Prisma, graphqlTestCall } from '../__utils'
import { CreateWeChatUsers } from '../__types'

const variables = {
  weChatUsers: [
    {
      username: 'aaaa',
      alias: 'bbbb',
      conRemark: 'cccc',
      nickname: 'dddd',
      avatar: {
        bigImg: 'http://a.com/b',
        thumbnailImg: 'http://b.com/a',
      },
    },
  ],
}

describe('Mutation', () => {
  /** @type {Prisma} */
  let prisma
  beforeEach(() => {
    prisma = new Prisma()
  })
  it('create WeChatUser', async () => {
    const result = await graphqlTestCall({
      query: CreateWeChatUsers,
      variables,
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
    expect(downloadManage.mock.calls.length).toBe(2)
    expect(result).toMatchSnapshot()
    expect(prisma.db.weChatUsers).toMatchSnapshot()
    expect(prisma.db.avatars).toMatchSnapshot()
  })
  it('create WeChatUser Fail No WeChat', async () => {
    const result = await graphqlTestCall({
      query: CreateWeChatUsers,
      variables,
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
