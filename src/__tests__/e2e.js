import gql from 'graphql-tag'

import { app, server } from '../index'
import { startTestServer, toPromise } from './__utils'
import {
  USERS,
  LOGIN,
  SIGNUP,
  CreateWeChatUsers,
  CreateChatRooms,
  WeChatUsers,
  ChatRooms,
} from './__types'
import { reset } from '../../data/reset'

describe('e2e', () => {
  /**
   * @type {() => import('http').Server}
   */
  let stop
  /**
   * @type {({ query, variables, token }: { query: any; variables?: any; token?: string; }) => import('apollo-link').Observable<import('apollo-link').FetchResult<{ [key: string]: any; }, Record<string, any>, Record<string, any>>>}
   */
  let graphql

  beforeEach(async () => {
    await reset()
    const testServer = await startTestServer(app, server)
    stop = testServer.stop
    graphql = testServer.graphql
  })

  afterEach(() => stop())

  it('signup', async () => {
    const variables = { name: 'aaa', email: 'aaa@b.com', password: 'ccc' }
    const res = await toPromise(
      graphql({
        query: gql(SIGNUP),
        variables,
      }),
    )

    const token = res.data && res.data.signup.token

    expect(token).toBeString()
  })
  it('login', async () => {
    const { ADMIN_EMAIL: email, ADMIN_PASSWD: password } = process.env
    const res = await toPromise(
      graphql({
        query: gql(LOGIN),
        variables: { email, password },
      }),
    )

    const token = res.data && res.data.login.token

    expect(token).toBeString()
  })
  it('users', async () => {
    const { ADMIN_EMAIL: email, ADMIN_PASSWD: password } = process.env
    const loginRes = await toPromise(
      graphql({
        query: gql(LOGIN),
        variables: { email, password },
      }),
    )

    const token = loginRes.data && loginRes.data.login.token

    const res = await toPromise(
      graphql({
        query: gql(USERS),
        token,
      }),
    )
    const users = res.data && res.data.users
    expect(users).toBeArray()
  })
  it('createWeChatUsers', async () => {
    const { ADMIN_EMAIL: email, ADMIN_PASSWD: password } = process.env
    const loginRes = await toPromise(
      graphql({
        query: gql(LOGIN),
        variables: { email, password },
      }),
    )

    const token = loginRes.data && loginRes.data.login.token
    const variables = {
      weChatUsers: [
        {
          username: 'aaaa',
          alias: 'bbbb',
          conRemark: 'cccc',
          nickname: 'dddd',
          avatar: {
            bigImg:
              'http://wx.qlogo.cn/mmhead/cypR72jV8BHjDwNh3Nc1YcsgzmiaZacpR1dgiaibt4QuMs/0',
            thumbnailImg:
              'http://wx.qlogo.cn/mmhead/cypR72jV8BHjDwNh3Nc1YcsgzmiaZacpR1dgiaibt4QuMs/132',
          },
        },
      ],
    }

    const res = await toPromise(
      graphql({
        query: gql(CreateWeChatUsers),
        variables,
        token,
      }),
    )
    const dbWeChatUsers = await toPromise(
      graphql({ query: gql(WeChatUsers), token }),
    )

    expect(res.data).toBeObject()
    expect(dbWeChatUsers.data && dbWeChatUsers.data.weChatUsers.length).toBe(2)
  })
  it('createChatRooms', async () => {
    const { ADMIN_EMAIL: email, ADMIN_PASSWD: password } = process.env
    const loginRes = await toPromise(
      graphql({
        query: gql(LOGIN),
        variables: { email, password },
      }),
    )

    const token = loginRes.data && loginRes.data.login.token
    const variables = {
      chatRooms: [
        {
          username: 'aaaa',
          nickname: 'bbbb',
          displayName: 'cccc',
          owner: 'demo',
          memberList: [],
          modifyTime: new Date('2019-04-24T16:51:14.743Z'),
          avatar: {
            bigImg:
              'http://wx.qlogo.cn/mmhead/cypR72jV8BHjDwNh3Nc1YcsgzmiaZacpR1dgiaibt4QuMs/0',
            thumbnailImg:
              'http://wx.qlogo.cn/mmhead/cypR72jV8BHjDwNh3Nc1YcsgzmiaZacpR1dgiaibt4QuMs/132',
          },
        },
      ],
    }

    const res = await toPromise(
      graphql({
        query: gql(CreateChatRooms),
        variables,
        token,
      }),
    )
    const dbChatRooms = await toPromise(
      graphql({ query: gql(ChatRooms), token }),
    )

    expect(res.data).toBeObject()
    expect(dbChatRooms.data && dbChatRooms.data.chatRooms.length).toBe(1)
  })
})
