import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import mime from 'mime-types'
import { prisma } from '../../generated/prisma-client'

const STATIC_PATH = path.join(__dirname, '../../public/static/')

if (!fs.existsSync(STATIC_PATH)) {
  fs.mkdirSync(STATIC_PATH, { recursive: true })
}

const randomMd5 = () => {
  const hash = crypto.createHash('md5')
  hash.update('' + new Date().getTime() + Math.random() * 10000)
  return hash.digest('hex')
}

/**
 * @param {string} str
 */
const strMd5 = str => {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

/**
 * @param {Promise<{ stream: NodeJS.ReadableStream; mimetype: string; }> | { stream: NodeJS.ReadableStream; mimetype: string; } } file
 * @returns {Promise<{ fileName: string; mimetype: string; size: number;}>}
 */
const saveFile = async file => {
  const { stream, mimetype } = await file
  const ext = mime.extension(mimetype)
  const hash = crypto.createHash('md5')
  const tempName = `${randomMd5()}.${ext}`
  const ws = fs.createWriteStream(path.join(STATIC_PATH, tempName))

  stream.on('data', chunk => {
    hash.update(chunk)
  })

  stream.pipe(ws)
  let size = 0
  stream.on('data', chunk => {
    size += chunk.length
  })

  return new Promise(function(resolve, reject) {
    ws.on('finish', err => {
      if (err) reject(err)

      const md5Str = hash.digest('hex')
      const fileName = `${md5Str}.${ext}`

      if (fs.existsSync(path.join(STATIC_PATH, fileName))) {
        fs.unlinkSync(path.join(STATIC_PATH, tempName))
        resolve({ fileName, mimetype, size })
      } else {
        fs.rename(
          path.join(STATIC_PATH, tempName),
          path.join(STATIC_PATH, fileName),
          err => {
            if (err) {
              // eslint-disable-next-line no-console
              console.log(err)
              reject(err)
            }
            resolve({ fileName, mimetype, size })
          },
        )
      }
    })
  })
}
/**
 *
 * @param {Object} fileIndex
 * @param {string} fileIndex.fileName
 * @param {string} fileIndex.mimetype
 * @param {number} fileIndex.size
 * @param {string} fileIndex.url
 * @returns {Promise<string>} id
 */
const saveToFileIndex = async ({ fileName, mimetype, size, url }) => {
  const [file] = await prisma.fileIndexes({ where: { fileName } })

  if (file) {
    return file.id
  }

  const { id } = await prisma
    .createFileIndex({ fileName, mimetype, size, url })
    .catch(err => {
      throw new Error(err)
    })
  return id
}

export { STATIC_PATH, strMd5, saveFile, randomMd5, saveToFileIndex }
