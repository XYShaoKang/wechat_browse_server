import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import mime from 'mime-types'

const APP_SECRET = process.env.APP_SECRET
export const STATIC_PATH = path.join(__dirname, '../public/static/')

if (!fs.existsSync(STATIC_PATH)) {
  fs.mkdirSync(STATIC_PATH, { recursive: true })
}

const getUserId = authorization => {
  const token = authorization.replace('Bearer ', '')
  const { userId } = jwt.verify(token, APP_SECRET)
  return userId
}

const generateToken = obj => jwt.sign(obj, APP_SECRET)

const randomMd5 = () => {
  const hash = crypto.createHash('md5')
  hash.update('' + new Date().getTime() + Math.random() * 10000)
  return hash.digest('hex')
}

const saveFile = async (file, mimetype) => {
  const ext = mime.extension(mimetype)
  const hash = crypto.createHash('md5')
  const tempName = `${randomMd5()}.${ext}`
  const ws = fs.createWriteStream(path.join(STATIC_PATH, tempName))

  file.on('data', chunk => {
    hash.update(chunk)
  })

  file.pipe(ws)

  return new Promise(function(resolve, reject) {
    file.on('end', err => {
      if (err) reject(err)
      const md5Str = hash.digest('hex')
      const fileName = `${md5Str}.${ext}`
      fs.rename(
        path.join(STATIC_PATH, tempName),
        path.join(STATIC_PATH, fileName),
        err => {
          if (err) reject(err)
          resolve(fileName)
        },
      )
    })
  })
}

export { APP_SECRET, getUserId, generateToken, saveFile }
