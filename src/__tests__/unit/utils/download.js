//#region mock

jest.mock('fs')
jest.mock('node-fetch')
jest.mock('../../../utils/file')
import * as nodeFetch from 'node-fetch'
import * as fileUtils from '../../../utils/file'

//#endregion

import { download } from '../../../utils'

const { Response } = jest.requireActual('node-fetch')

const APP_SECRET = 'test'
process.env.APP_SECRET = APP_SECRET

describe('download', () => {
  it('Success', async () => {
    const url = 'http://a.com'
    const resultData = { fileName: '', mimetype: '', size: 4 }
    const saveFile = jest.fn(async () => {
      return resultData
    })

    jest
      .spyOn(nodeFetch, 'default')
      .mockImplementation(() => Promise.resolve(new Response()))
    jest.spyOn(fileUtils, 'saveFile').mockImplementation(saveFile)

    const result = await download(url).toPromise()

    expect(saveFile.mock.calls.length).toBe(1)
    expect(result).toEqual({ ...resultData, url })
  })
})
