/**
 * @typedef {import ('koa')} Koa
 */

import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { execute, toPromise } from 'apollo-link'

const startTestServer =
  /**
   * @param { Koa } app
   * @param { import('apollo-server-koa').ApolloServer } server
   */
  async (app, server) => {
    const httpServer = await app.listen({ port: 0 })
    /**
     * @type {any}
     */
    const address = httpServer.address()

    /**
     *
     * @param {{query:any,variables?:object,token?:string}} arg
     */
    const executeOperation = ({ query, variables = {}, token }) => {
      // @ts-ignore
      const link = new HttpLink({
        uri: `http://localhost:${address.port}${server.graphqlPath}`,
        fetch,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return execute(link, { query, variables })
    }

    return {
      stop: () => httpServer.close(),
      graphql: executeOperation,
    }
  }

export { startTestServer, toPromise }
