//#region mock

jest.mock('fs')
import fs from 'fs'

//#endregion

import { Readable } from 'stream'

const { saveFile, strMd5 } = jest.requireActual('../../../utils/file')
const { createWriteStream } = jest.requireActual('fs')

describe('saveFile', () => {
  it('New File', async () => {
    const testStr = 'abcd'
    const stream = new Readable({
      read() {},
    })
    const write = jest.fn((chunk, encoding, fn) => fn())
    const mockCWS = jest.fn((path, options) => {
      const output = createWriteStream(path, options)
      output._write = write
      return output
    })
    const mockES = jest.fn(() => false)
    const mockRename = jest.fn((old, newName, fn) => {
      fn(null)
    })

    jest.spyOn(fs, 'createWriteStream').mockImplementation(mockCWS)
    jest.spyOn(fs, 'existsSync').mockImplementation(mockES)
    jest.spyOn(fs, 'rename').mockImplementation(mockRename)

    stream.push(testStr)
    stream.push(null)

    const result = await saveFile({ stream, mimetype: 'text/plain' })

    expect(mockCWS).toHaveBeenCalledTimes(1)
    expect(mockES).toHaveBeenCalledTimes(1)
    expect(mockRename).toHaveBeenCalledTimes(1)
    expect(write).toHaveBeenCalledTimes(1)
    expect(result.fileName).toEqual(strMd5(testStr) + '.txt')
    expect(result.size).toEqual(testStr.length)
    expect(write.mock.calls[0][0].toString()).toBe(testStr)
  })
  it('Existing File', async () => {
    const testStr = 'abcd'
    const stream = new Readable({
      read() {},
    })
    const write = jest.fn((chunk, encoding, fn) => fn())
    const mockCWS = jest.fn((path, options) => {
      const output = createWriteStream(path, options)
      output._write = write
      return output
    })
    const mockES = jest.fn(() => true)
    const mockRename = jest.fn((old, newName, fn) => {
      fn(null)
    })

    jest.spyOn(fs, 'createWriteStream').mockImplementation(mockCWS)
    jest.spyOn(fs, 'existsSync').mockImplementation(mockES)
    jest.spyOn(fs, 'rename').mockImplementation(mockRename)

    stream.push(testStr)
    stream.push(null)

    const result = await saveFile({ stream, mimetype: 'text/plain' })

    expect(mockCWS).toHaveBeenCalledTimes(1)
    expect(mockES).toHaveBeenCalledTimes(1)
    expect(mockRename).toHaveBeenCalledTimes(0)
    expect(write).toHaveBeenCalledTimes(1)
    expect(result.fileName).toEqual(strMd5(testStr) + '.txt')
    expect(result.size).toEqual(testStr.length)
    expect(write.mock.calls[0][0].toString()).toBe(testStr)
  })
})
