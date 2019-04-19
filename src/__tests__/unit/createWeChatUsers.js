jest.mock('../../utils/download')

import { of } from 'rxjs'

import { constructTestServer } from '../__utils'
import { CreateWeChatUsers } from './__types'
// @ts-ignore
import * as downloadManageUtils from '../../utils/downloadManage'

let id = 0
const downloadManage = jest.fn(() => {
  return of(++id + '')
})
// @ts-ignore
downloadManageUtils.downloadManage = downloadManage

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
  it('create WeChatUser', async () => {
    const { mutate, prisma } = constructTestServer({
      // @ts-ignore
      context: { currentWeChat: { id: 1 } },
    })

    const result = await mutate({
      mutation: CreateWeChatUsers,
      // @ts-ignore
      variables,
    })

    expect(result.data.CreateWeChatUsers.id).toBe('1')
    expect(prisma.updateWeChat.mock.calls.length).toBe(1)
    expect(downloadManage.mock.calls.length).toBe(2)
  })
  it('create WeChatUser Fail No WeChat', async () => {
    const { mutate } = constructTestServer()
    const result = await mutate({
      mutation: CreateWeChatUsers,
      // @ts-ignore
      variables,
    })

    expect(result.errors[0].message).toBe('No WeChat')
  })
})
