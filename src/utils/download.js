import fetch from 'node-fetch'

// import { prisma } from '../../generated/prisma-client'
import { saveFile } from './file'

/**
 * @param {string} url
 * @returns {Promise<{stream:NodeJS.ReadableStream; mimetype:string;}>}
 */
const getFile = (url, retryCount = 0) => {
  return fetch(url)
    .then(res => {
      return {
        stream: res.body,
        mimetype: res.headers.get('content-type') || '',
      }
    })
    .catch(err => {
      if (err.message.includes('connect ETIMEDOUT') && retryCount < 3) {
        retryCount++
        return new Promise(function(resolve) {
          setTimeout(() => {
            resolve()
          }, 1000)
        }).then(() => {
          return getFile(url, retryCount)
        })
      }
      throw new Error(err)
    })
}

/**
 * @param {string} url
 * @returns {Promise<{fileName:string; mimetype:string; size:number; url:string;}>} fileIndex id
 */
const download = async url => {
  if (!url) {
    // @ts-ignore
    return null
  }

  // 下载文件
  const fileStream = await getFile(url)

  // // 保存文件
  // @ts-ignore
  const { fileName, mimetype, size } = await saveFile(fileStream)
  return { fileName, mimetype, size, url }
}

export { download, getFile }
