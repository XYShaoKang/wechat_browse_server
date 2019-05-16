import gql from 'graphql-tag'
import { toPromise } from '.'

import { LOGIN } from './../__types'

/**
 * @param {({ query, variables, token }: { query: any; variables?: any; token?: string; }) => import('apollo-link').Observable<import('apollo-link').FetchResult<{ [key: string]: any; }, Record<string, any>, Record<string, any>>>} graphql
 * @returns {Promise<{token:string}>}
 */
const login = async graphql => {
  const { ADMIN_EMAIL: email, ADMIN_PASSWD: password } = process.env
  const loginRes = await toPromise(
    graphql({
      query: gql(LOGIN),
      variables: { email, password },
    }),
  )

  const token = loginRes.data && loginRes.data.login.token
  return { token }
}

export { login }
