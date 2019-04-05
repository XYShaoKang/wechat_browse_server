import jwt from 'jsonwebtoken'

const APP_SECRET = process.env.APP_SECRET

const getUserId = authorization => {
  const token = authorization.replace('Bearer ', '')
  const { userId } = jwt.verify(token, APP_SECRET)
  return userId
}

const generateToken = obj => jwt.sign(obj, APP_SECRET)

export { APP_SECRET, getUserId, generateToken }
