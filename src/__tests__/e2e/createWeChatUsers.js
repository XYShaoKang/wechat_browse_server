import gql from 'graphql-tag'

import { app, server } from '../../index'
import { startTestServer, toPromise, login } from './../__utils'
import { CreateWeChatUsers, WeChatUsers } from './../__types'
import { reset } from '../../../data/reset'
import { weChatUserData } from '../__variables'

describe('e2e createWeChatUsers', () => {
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

  it('createWeChatUsers', async () => {
    const { token } = await login(graphql)

    const res = await toPromise(
      graphql({
        query: gql(CreateWeChatUsers),
        variables: weChatUserData,
        token,
      }),
    )
    const dbWeChatUsers = await toPromise(
      graphql({ query: gql(WeChatUsers), token }),
    )

    expect(res.data).toBeObject()
    expect(dbWeChatUsers.data && dbWeChatUsers.data.weChatUsers.length).toBe(2)
  })
})
