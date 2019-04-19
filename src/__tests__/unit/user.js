import { constructTestServer } from '../__utils'
import { LOGIN, SIGNUP, USERS } from './__types'

const mockUsers = [
  {
    id: '1',
    name: 'a',
    email: 'a@a.com',
    password: '$2a$10$faeVK0d72BU6m3YUnB/NLO.Pc3DLrZr5kpF4pd5HvTneYiBR3G3jy',
  },
]

describe('Queries', () => {
  it('users', async () => {
    const { query, prisma } = constructTestServer()
    prisma.setDB({ users: mockUsers })

    const result = await query({ query: USERS })

    expect(prisma.users.mock.calls.length).toBe(1)
    // @ts-ignore
    expect(result.data.users).toEqual(prisma.db.users)
    // @ts-ignore
    expect(result.data.users).toEqual(mockUsers)
  })
})

describe('Mutation', () => {
  it('signup', async () => {
    const { mutate, prisma } = constructTestServer()

    const result = await mutate({
      mutation: SIGNUP,
      // @ts-ignore
      variables: { name: 'a', email: 'a@a.com', password: 'a' },
    })
    expect(prisma.createUser.mock.calls.length).toBe(1)
    expect(prisma.user.mock.calls.length).toBe(2)
    expect(prisma.weChat.mock.calls.length).toBe(1)
    expect(result.data.signup.user).toEqual(prisma.db.users[0])
  })

  it('signup Email Already Exists', async () => {
    const { mutate, prisma } = constructTestServer()
    prisma.setDB({ users: mockUsers })

    const result = await mutate({
      mutation: SIGNUP,
      // @ts-ignore
      variables: { name: 'a', email: 'a@a.com', password: 'a' },
    })
    expect(prisma.createUser.mock.calls.length).toBe(0)
    expect(prisma.user.mock.calls.length).toBe(1)
    expect(prisma.weChat.mock.calls.length).toBe(0)
    expect(result.errors[0].message).toBe('Email Already Exists')
  })

  it('login Success', async () => {
    const { mutate, prisma } = constructTestServer()
    prisma.setDB({ users: mockUsers })

    const result = await mutate({
      mutation: LOGIN,
      // @ts-ignore
      variables: { email: 'a@a.com', password: 'a' },
    })

    expect(prisma.user.mock.calls.length).toBe(2)
    expect(prisma.weChat.mock.calls.length).toBe(1)
    expect(result.data.login.user).toEqual(prisma.db.users[0])
  })

  it('login Fail Invalid password', async () => {
    const { mutate, prisma } = constructTestServer()
    prisma.setDB({ users: mockUsers })

    const result = await mutate({
      mutation: LOGIN,
      // @ts-ignore
      variables: { email: 'a@a.com', password: 'b' },
    })

    expect(prisma.user.mock.calls.length).toBe(1)
    expect(prisma.weChat.mock.calls.length).toBe(0)
    expect(result.errors[0].message).toBe('Invalid password')
  })

  it('login Fail No such user found', async () => {
    const { mutate, prisma } = constructTestServer()
    prisma.setDB({ users: mockUsers })

    const result = await mutate({
      mutation: LOGIN,
      // @ts-ignore
      variables: { email: 'b@b.com', password: 'a' },
    })

    expect(prisma.user.mock.calls.length).toBe(1)
    expect(prisma.weChat.mock.calls.length).toBe(0)
    expect(result.errors[0].message).toBe('No such user found')
  })
})
