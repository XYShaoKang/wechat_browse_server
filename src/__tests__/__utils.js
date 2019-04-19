import { ApolloServer } from 'apollo-server-koa'
import { createTestClient } from 'apollo-server-testing'
import { makePrismaSchema } from 'nexus-prisma'
import dotenv from 'dotenv'
import * as R from 'ramda'

import { prisma as defaultPrisma } from '../../generated/prisma-client'
import datamodelInfo from '../../generated/nexus-prisma'
import * as allTypes from '../resolvers'
import { context as defaultContext } from '../'

dotenv.config({ path: '.env' })
// @ts-ignore
const constructTestServer = ({ context = defaultContext } = {}) => {
  const prisma = new Prisma()
  const schema = makePrismaSchema({
    types: allTypes,
    prisma: {
      datamodelInfo,
      client: { ...defaultPrisma, ...prisma },
    },
    outputs: {
      schema: '',
      typegen: '',
    },
  })
  const server = new ApolloServer({
    schema,
    context: { ...context, prisma: { ...defaultPrisma, ...prisma } },
  })
  const { query, mutate } = createTestClient(server)
  return { query, mutate, prisma }
}

/**
 * @constructor
 * @this Prisma
 */
function Prisma() {
  this.db = { users: [], weChats: [] }
  let promise = Promise.resolve({})

  this.createUser = jest.fn(user => {
    promise = promise.then(() => {
      // @ts-ignore
      const tempUser = this.db.users.find(({ email }) => email === user.email)

      if (tempUser) {
        throw new Error(
          'A unique constraint would be violated on User. Details: Field name = email',
        )
      }
      const newUser = {
        id: '1',
        ...user,
      }
      this.db.users.push(newUser)
      return Promise.resolve(newUser)
    })
    return this
  })

  this.user = jest.fn(({ id, email }) => {
    promise = promise.then(() =>
      Promise.resolve(
        this.db.users.find(
          /**
           * @param {{ id: string; email: string; }} user
           */
          user => user.id === id || user.email === email,
        ),
      ),
    )
    return this
  })

  this.users = jest.fn(() => {
    promise = promise.then(() => Promise.resolve(this.db.users))
    return this
  })

  this.weChat = jest.fn(() => {
    promise = promise.then(() =>
      Promise.resolve({
        id: 2,
      }),
    )
    return this
  })

  this.updateWeChat = jest.fn(({ where }) => {
    promise = promise.then(() =>
      Promise.resolve({
        id: where.id,
      }),
    )
    return this
  })

  /**
   * @param {any} db
   */
  this.setDB = db => {
    this.db = R.clone(db)
  }
  /**
   * @param {((value: {}) => {} | PromiseLike<{}>)} fn
   */
  this.then = fn => promise.then(fn)
}

export { constructTestServer, Prisma }
