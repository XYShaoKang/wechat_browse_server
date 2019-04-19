jest.mock('../../utils/download')

import { of } from 'rxjs'

import { constructTestServer } from '../__utils'
import { CreateChatRooms } from './__types'
// @ts-ignore
import * as downloadManageUtils from '../../utils/downloadManage'

let id = 0
const downloadManage = jest.fn(() => {
  return of(++id + '')
})
// @ts-ignore
downloadManageUtils.downloadManage = downloadManage

const variables = {
  chatRooms: [
    {
      username: 'aaaa',
      nickname: 'bbbb',
      displayName: 'cccc',
      owner: '',
      memberList: [''],
      modifyTime: new Date(),
      avatar: {
        bigImg: 'http://a.com/b',
        thumbnailImg: 'http://b.com/a',
      },
    },
  ],
}

describe.only('Mutation', () => {
  it('create ChatRoom', async () => {
    const { mutate, prisma } = constructTestServer({
      // @ts-ignore
      context: { currentWeChat: { id: 1 } },
    })

    const result = await mutate({
      mutation: CreateChatRooms,
      // @ts-ignore
      variables,
    })

    expect(result.data.CreateChatRooms.id).toBe('1')
    expect(prisma.updateWeChat.mock.calls.length).toBe(1)
    expect(downloadManage.mock.calls.length).toBe(2)
  })
  it('create WeChatUser Fail No WeChat', async () => {
    const { mutate } = constructTestServer()
    const result = await mutate({
      mutation: CreateChatRooms,
      // @ts-ignore
      variables,
    })

    expect(result.errors[0].message).toBe('No WeChat')
  })
})
