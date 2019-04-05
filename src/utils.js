import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-koa'

const APP_SECRET = process.env.APP_SECRET

const getUserId = authorization => {
  const token = authorization.replace('Bearer ', '')
  const { userId } = jwt.verify(token, APP_SECRET)
  return userId
}

const authenticated = next => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new AuthenticationError(`Unauthenticated!`)
  }

  return next(root, args, context, info)
}

const generateToken = obj => jwt.sign(obj, APP_SECRET)

module.exports = {
  APP_SECRET,
  getUserId,
  authenticated,
  generateToken,
}
