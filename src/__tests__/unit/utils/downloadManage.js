//#region mock

jest.mock('../../../utils/download')
jest.mock('../../../utils/file')

import * as downloadUtils from '../../../utils/download'
import * as fileUtils from '../../../utils/file'

//#endregion

import { marbles } from 'rxjs-marbles/jest'
import { of, from } from 'rxjs'
import * as R from 'ramda'

import { download$, saveToFileIndex$ } from '../../../utils'
import { delay, scan } from 'rxjs/operators'

describe('download$', () => {
  it(
    'Test download$ with 5 thread',
    marbles(m => {
      const data = {
        a: {
          url: 'http://a.com',
          key: 'a',
          time: 15,
          id: 1,
          mimetype: 'file',
          size: 0,
        },
        b: {
          url: 'http://b.com',
          key: 'b',
          time: 15,
          id: 2,
          mimetype: 'file',
          size: 0,
        },
        c: {
          url: 'http://c.com',
          key: 'c',
          time: 15,
          id: 3,
          mimetype: 'file',
          size: 0,
        },
        d: {
          url: 'http://d.com',
          key: 'd',
          time: 15,
          id: 4,
          mimetype: 'file',
          size: 0,
        },
        e: {
          url: 'http://e.com',
          key: 'e',
          time: 15,
          id: 5,
          mimetype: 'file',
          size: 0,
        },
        f: {
          url: 'http://f.com',
          key: 'f',
          time: 2,
          id: 6,
          mimetype: 'file',
          size: 0,
        },
      }
      const arr = Object.values(data)

      const download = jest.fn(url => {
        const file = R.find(R.propEq('url', url), arr)
        if (file && file.id) {
          const { id, time } = file

          return of({
            url,
            fileName: `${id}.file`,
            mimetype: 'file',
            size: 0,
          }).pipe(delay(time, m.scheduler))
        }
        throw new Error('no find file')
      })
      jest.spyOn(downloadUtils, 'download').mockImplementation(download)

      const sourceValues = R.mapObjIndexed(({ url, key }) => ({ url, key }))(
        data,
      )
      const expectedValues = R.mapObjIndexed(
        ({ id, key, url, mimetype, size }) => {
          const fileName = `${id}.file`
          return {
            key,
            file: {
              fileName,
              url,
              mimetype,
              size,
            },
          }
        },
      )(data)

      const source = m.cold('  -a-b---c-d-e-f----------------|', sourceValues)
      const expected = m.cold('----------------a-(bf)c-d-(e)-|', expectedValues)

      const actual = source.pipe(download$(5))
      m.expect(actual).toBeObservable(expected)
    }),
  )
  it(
    'Test download$ with 2 thread',
    marbles(m => {
      const data = {
        a: {
          url: 'http://a.com',
          key: 'a',
          time: 10,
          id: 1,
          mimetype: 'file',
          size: 0,
        },
        b: {
          url: 'http://b.com',
          key: 'b',
          time: 10,
          id: 2,
          mimetype: 'file',
          size: 0,
        },
        c: {
          url: 'http://c.com',
          key: 'c',
          time: 10,
          id: 3,
          mimetype: 'file',
          size: 0,
        },
        d: {
          url: 'http://d.com',
          key: 'd',
          time: 10,
          id: 4,
          mimetype: 'file',
          size: 0,
        },
        e: {
          url: 'http://e.com',
          key: 'e',
          time: 10,
          id: 5,
          mimetype: 'file',
          size: 0,
        },
        f: {
          url: 'http://f.com',
          key: 'f',
          time: 2,
          id: 6,
          mimetype: 'file',
          size: 0,
        },
      }
      const arr = Object.values(data)

      const download = jest.fn(url => {
        const file = R.find(R.propEq('url', url), arr)
        if (file && file.id) {
          const { id, time } = file

          return of({
            url,
            fileName: `${id}.file`,
            mimetype: 'file',
            size: 0,
          }).pipe(delay(time, m.scheduler))
        }
        throw new Error('no find file')
      })
      jest.spyOn(downloadUtils, 'download').mockImplementation(download)

      const sourceValues = R.mapObjIndexed(({ url, key }) => ({ url, key }))(
        data,
      )
      const expectedValues = R.mapObjIndexed(
        ({ id, key, url, mimetype, size }) => {
          const fileName = `${id}.file`
          return {
            key,
            file: {
              fileName,
              url,
              mimetype,
              size,
            },
          }
        },
      )(data)

      const source = m.cold('  -a-b---c-d-e-f------------------|', sourceValues)
      const expected = m.cold(
        '-----------a-b-------c-d-f-----e|',
        expectedValues,
      )

      const actual = source.pipe(download$(2))
      m.expect(actual).toBeObservable(expected)
    }),
  )
})

describe('saveToFileIndex$', () => {
  it('When duplicated fileName coming in', async () => {
    {
      const sourceValues = [
        { fileName: 'file1', id: 1 },
        { fileName: 'file2', id: 2 },
        { fileName: 'file3', id: 3 },
        { fileName: 'file1', id: 4 },
      ]
      const saveToFileIndex = jest.fn(file => Promise.resolve(file.id))

      jest
        .spyOn(fileUtils, 'saveToFileIndex')
        .mockImplementation(saveToFileIndex)

      /** @type {array} */
      const result = await from(sourceValues)
        .pipe(
          saveToFileIndex$(),
          scan((acc, value) => acc.concat(value), []),
        )
        .toPromise()
      expect(result).toEqual([1, 2, 3, 1])
    }
  })
})
