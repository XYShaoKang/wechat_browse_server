import gql from 'graphql-tag'

import { app, server } from '../../index'
import { startTestServer, toPromise } from './../__utils'
import { USERS, LOGIN, SIGNUP } from './../__types'
import { reset } from '../../../data/reset'

describe('e2e user', () => {
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
})
