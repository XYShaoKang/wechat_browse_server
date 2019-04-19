jest.mock('../../../utils/download')
jest.mock('../../../utils/file')

import { marbles } from 'rxjs-marbles/jest'
import { of, from } from 'rxjs'
import * as R from 'ramda'

import * as downloadUtils from '../../../utils/download'
import * as fileUtils from '../../../utils/file'
import { download$, saveToFileIndex$ } from '../../../utils'
import { delay, scan } from 'rxjs/operators'

describe('download$', () => {
  it(
    'Test download$ with 5 thread',
    marbles(m => {
      const data = {
        a: { url: 'http://a.com', key: 'a', time: 15, id: 1 },
        b: { url: 'http://b.com', key: 'b', time: 15, id: 2 },
        c: { url: 'http://c.com', key: 'c', time: 15, id: 3 },
        d: { url: 'http://d.com', key: 'd', time: 15, id: 4 },
        e: { url: 'http://e.com', key: 'e', time: 15, id: 5 },
        f: { url: 'http://f.com', key: 'f', time: 2, id: 6 },
      }
      const arr = R.pipe(
        // @ts-ignore
        R.toPairs,
        R.map(R.last),
      )(data)

      const download = jest.fn(url => {
        const { id, time } = R.find(R.propEq('url', url), arr)
        return of({ url, fileName: `${id}.file` }).pipe(
          delay(time, m.scheduler),
        )
      })
      // @ts-ignore
      downloadUtils.download = download

      // @ts-ignore
      const sourceValues = R.map(({ url, key }) => ({ url, key }))(data)
      const expectedValues = R.map(({ id, key, url }) => {
        const fileName = `${id}.file`
        return {
          key,
          file: {
            fileName,
            url,
          },
        }
        // @ts-ignore
      })(data)

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
        a: { url: 'http://a.com', key: 'a', time: 10, id: 1 },
        b: { url: 'http://b.com', key: 'b', time: 10, id: 2 },
        c: { url: 'http://c.com', key: 'c', time: 10, id: 3 },
        d: { url: 'http://d.com', key: 'd', time: 10, id: 4 },
        e: { url: 'http://e.com', key: 'e', time: 10, id: 5 },
        f: { url: 'http://f.com', key: 'f', time: 2, id: 6 },
      }
      const arr = R.pipe(
        // @ts-ignore
        R.toPairs,
        R.map(R.last),
      )(data)

      const download = jest.fn(url => {
        const { id, time } = R.find(R.propEq('url', url), arr)
        return of({ url, fileName: `${id}.file` }).pipe(
          delay(time, m.scheduler),
        )
      })
      // @ts-ignore
      downloadUtils.download = download

      // @ts-ignore
      const sourceValues = R.map(({ url, key }) => ({ url, key }))(data)
      const expectedValues = R.map(({ id, key, url }) => {
        const fileName = `${id}.file`
        return {
          key,
          file: {
            fileName,
            url,
          },
        }
        // @ts-ignore
      })(data)

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
      // @ts-ignore
      fileUtils.saveToFileIndex = saveToFileIndex
      /** @type {any[number]} */
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
