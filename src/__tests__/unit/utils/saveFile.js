jest.mock('fs')
import fs from 'fs'
import { Readable, Writable } from 'stream'

describe('saveFile', () => {
  it('New File', async () => {
    const { saveFile, strMd5 } = jest.requireActual('../../../utils/file')
    const testStr = 'abcd'
    const stream = new Readable({
      read() {},
    })
    // @ts-ignore
    const write = jest.fn((chunk, encoding, fn) => fn())
    const ws = new Writable({ write })

    const mockCWS = jest.fn(() => ws)
    const mockES = jest.fn(() => false)

    // @ts-ignore
    fs.createWriteStream = mockCWS
    // @ts-ignore
    fs.existsSync = mockES
    // @ts-ignore
    fs.rename = jest.fn((_, __, fn) => {
      fn()
    })

    stream.push(testStr)
    stream.push(null)

    const result = await saveFile({ stream, mimetype: 'text/plain' })

    expect(mockCWS).toHaveBeenCalledTimes(1)
    expect(mockES).toHaveBeenCalledTimes(1)
    expect(fs.rename).toHaveBeenCalledTimes(1)
    expect(write).toHaveBeenCalledTimes(1)
    expect(result.fileName).toEqual(strMd5(testStr) + '.txt')
    expect(result.size).toEqual(testStr.length)
    expect(write.mock.calls[0][0].toString()).toBe(testStr)
  })
  it('Existing File', async () => {
    const { saveFile, strMd5 } = jest.requireActual('../../../utils/file')
    const testStr = 'abcd'
    const stream = new Readable({
      read() {},
    })
    // @ts-ignore
    const write = jest.fn((chunk, encoding, fn) => fn())
    const ws = new Writable({ write })

    const mockCWS = jest.fn(() => ws)
    const mockES = jest.fn(() => true)

    // @ts-ignore
    fs.createWriteStream = mockCWS
    // @ts-ignore
    fs.existsSync = mockES
    // @ts-ignore
    fs.rename = jest.fn((_, __, fn) => {
      fn()
    })

    stream.push(testStr)
    stream.push(null)

    const result = await saveFile({ stream, mimetype: 'text/plain' })

    expect(mockCWS).toHaveBeenCalledTimes(1)
    expect(mockES).toHaveBeenCalledTimes(1)
    expect(fs.rename).toHaveBeenCalledTimes(0)
    expect(write).toHaveBeenCalledTimes(1)
    expect(result.fileName).toEqual(strMd5(testStr) + '.txt')
    expect(result.size).toEqual(testStr.length)
    expect(write.mock.calls[0][0].toString()).toBe(testStr)
  })
})
