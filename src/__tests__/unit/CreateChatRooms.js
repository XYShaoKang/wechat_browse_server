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
import { CreateChatRooms } from './__types'

const variables = {
  chatRooms: [
    {
      username: 'aaaa',
      nickname: 'bbbb',
      displayName: 'cccc',
      owner: '',
      memberList: ['dddd'],
      modifyTime: new Date('2019-04-24T16:51:14.743Z'),
      avatar: {
        bigImg: 'http://a.com/b',
        thumbnailImg: 'http://b.com/a',
      },
    },
  ],
}

describe.only('Mutation', () => {
  /** @type {Prisma} */
  let prisma
  beforeEach(() => {
    prisma = new Prisma()
  })
  it('create ChatRoom', async () => {
    const result = await graphqlTestCall({
      query: CreateChatRooms,
      variables,
      context: {
        prisma,
        currentUser: { id: '0' },
        currentWeChat: { id: '0' },
      },
    })

    const id = result.data && result.data.CreateChatRooms.id

    expect(id).toBe('0')
    expect(prisma.updateWeChat.mock.calls.length).toBe(1)
    expect(downloadManage.mock.calls.length).toBe(2)
    expect(result).toMatchSnapshot()
    expect(prisma.db.chatRooms).toMatchSnapshot()
    expect(prisma.db.avatars).toMatchSnapshot()
  })
  it('create WeChatUser Fail No WeChat', async () => {
    const result = await graphqlTestCall({
      query: CreateChatRooms,
      variables,
      context: { prisma, currentUser: { id: '0' } },
    })
    const message = result.errors && result.errors[0].message

    expect(message).toBe('No WeChat')
    expect(result).toMatchSnapshot()
  })
})
