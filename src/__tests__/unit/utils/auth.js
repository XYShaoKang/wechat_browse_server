import { getUserId, generateToken } from '../../../utils'

describe('auth', () => {
  it('Crypto', () => {
    const token = generateToken({ userId: '123' })
    const { userId } = getUserId(token)
    expect(userId).toBe('123')
  })
  it('Decrypt fail', () => {
    try {
      getUserId('aaa')
    } catch (error) {
      expect(error).toEqual({
        name: 'JsonWebTokenError',
        message: 'jwt malformed',
      })
    }
  })
})
