jest.mock('fs')
jest.mock('node-fetch')
jest.mock('../../../utils/file')
import fetch from 'node-fetch'

const { Response } = jest.requireActual('node-fetch')

import { download } from '../../../utils'
import * as fileUtils from '../../../utils/file'

const APP_SECRET = 'test'
process.env.APP_SECRET = APP_SECRET

describe('download', () => {
  it('Success', async () => {
    const url = 'http://a.com'
    const resultData = { fileName: '', mimetype: '', size: 4 }
    const saveFile = jest.fn(() => {
      return resultData
    })

    // @ts-ignore
    fetch.mockReturnValue(Promise.resolve(new Response()))
    // @ts-ignore
    fileUtils.saveFile = saveFile

    const result = await download(url)

    expect(saveFile.mock.calls.length).toBe(1)
    expect(result).toEqual({ ...resultData, url })
  })
})
