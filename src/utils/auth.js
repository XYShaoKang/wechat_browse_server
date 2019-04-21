import jwt from 'jsonwebtoken'

/**
 * @param {string} authorization
 * @returns {{userId:string,weChatId:string}}
 */
export const getUserId = authorization => {
  const token = authorization.replace('Bearer ', '')
  /**
   * @type {object}
   */
  const result = jwt.verify(token, process.env.APP_SECRET || '')
  return result
}

/**
 * @param {string | object | Buffer} obj
 */
export const generateToken = obj => {
  return jwt.sign(obj, process.env.APP_SECRET || '')
}
