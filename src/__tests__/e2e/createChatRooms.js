import gql from 'graphql-tag'

import { app, server } from '../../index'
import { startTestServer, toPromise, login } from './../__utils'
import { CreateChatRooms, ChatRooms } from './../__types'
import { reset } from '../../../data/reset'

import { chatRoomData } from '../__variables'
import { weChatUserSeed } from '../__seed'

describe('e2e createChatRooms', () => {
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

  it('createChatRooms', async () => {
    await weChatUserSeed()
    const { token } = await login(graphql)

    const res = await toPromise(
      graphql({
        query: gql(CreateChatRooms),
        variables: chatRoomData,
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
