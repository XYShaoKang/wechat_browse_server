//#region mock

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//#endregion

import { Prisma, graphqlTestCall } from '../__utils'
import { LOGIN, SIGNUP, USERS } from './__types'

jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'abcd')
jest.spyOn(jwt, 'sign').mockImplementation(() => 'abcd')

/** @type {Prisma} */
let prisma
beforeEach(() => {
  prisma = new Prisma()
})

describe('Queries', () => {
  it('users', async () => {
    const result = await graphqlTestCall({
      query: USERS,
      context: {
        prisma,
        currentUser: { id: '0' },
      },
    })

    expect(prisma.users).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })
  it('users no auth', async () => {
    const result = await graphqlTestCall({
      query: USERS,
      context: {
        prisma,
      },
    })

    const message = result.errors && result.errors[0].message

    expect(message).toBe('Not Authorised!')
    expect(prisma.users).not.toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })
})

describe('Mutation', () => {
  it('signup', async () => {
    const result = await graphqlTestCall({
      query: SIGNUP,
      variables: { name: 'a', email: 'b@a.com', password: 'a' },
      context: { prisma },
    })

    expect(prisma.user).toHaveBeenCalled()
    expect(prisma.createUser).toHaveBeenCalled()
    expect(prisma.weChats).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })

  it('signup Email Already Exists', async () => {
    const result = await graphqlTestCall({
      query: SIGNUP,
      variables: { name: 'a', email: 'a@a.com', password: 'a' },
      context: { prisma },
    })

    const message = result.errors && result.errors[0].message

    expect(prisma.user).toHaveBeenCalled()
    expect(prisma.createUser).not.toHaveBeenCalled()
    expect(prisma.weChats).not.toHaveBeenCalled()
    expect(message).toBe('Email Already Exists')
    expect(result).toMatchSnapshot()
  })

  it('login Success', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true)

    const result = await graphqlTestCall({
      query: LOGIN,
      variables: { email: 'a@a.com', password: 'a' },
      context: { prisma },
    })

    expect(prisma.user).toHaveBeenCalled()
    expect(result).toMatchSnapshot()
  })

  it('login Fail Invalid password', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false)

    const result = await graphqlTestCall({
      query: LOGIN,
      variables: { email: 'a@a.com', password: 'b' },
      context: { prisma },
    })

    const message = result.errors && result.errors[0].message

    expect(prisma.user).toHaveBeenCalled()
    expect(message).toBe('Invalid password')
    expect(result).toMatchSnapshot()
  })

  it('login Fail No such user found', async () => {
    const result = await graphqlTestCall({
      query: LOGIN,
      variables: { email: 'b@b.com', password: 'a' },
      context: { prisma },
    })

    const message = result.errors && result.errors[0].message

    expect(prisma.user).toHaveBeenCalled()
    expect(message).toBe('No such user found')
    expect(result).toMatchSnapshot()
  })
})
