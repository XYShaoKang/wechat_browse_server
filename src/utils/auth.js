import jwt from 'jsonwebtoken'

/**
 * @param {string} authorization
 * @returns {{userId:string,weChatId:string}}
 */
export const getUserId = authorization => {
  const token = authorization.replace('Bearer ', '')
  // @ts-ignore
  return jwt.verify(token, process.env.APP_SECRET || '')
}

/**
 * @param {string | object | Buffer} obj
 */
export const generateToken = obj => {
  return jwt.sign(obj, process.env.APP_SECRET || '')
}
