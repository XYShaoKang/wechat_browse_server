import gql from 'graphql-tag'

import { app, server } from '../../index'
import { startTestServer, toPromise, login } from './../__utils'
import { CreateMessages, Messages } from './../__types'
import { reset } from '../../../data/reset'

import { messageData } from '../__variables'
import { weChatUserSeed, chatRoomSeed } from '../__seed'

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

  it('createMessages', async () => {
    await weChatUserSeed()
    await chatRoomSeed()
    const { token } = await login(graphql)

    const res = await toPromise(
      graphql({
        query: gql(CreateMessages),
        variables: messageData,
        token,
      }),
    )
    const messgaes = await toPromise(graphql({ query: gql(Messages), token }))

    expect(res.data).toBeObject()
    expect(messgaes.data && messgaes.data.messages.length).toBe(3)
  })
})
