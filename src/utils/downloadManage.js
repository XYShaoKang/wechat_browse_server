import { Subject, from, of } from 'rxjs'
import {
  filter,
  pluck,
  first,
  map,
  scan,
  mergeMap,
  publishReplay,
  refCount,
  combineAll,
  flatMap,
} from 'rxjs/operators'

import { randomMd5, saveToFileIndex } from './file'
import { download } from './download'
import { cache } from './other'

const store = new Subject()
const thread = 20

export const download$ = (thread = 5) => {
  return mergeMap(
    /**
     * @param {{key:string,url:string}} arg
     */
    ({ key, url }) => from(download(url)).pipe(map(file => ({ key, file }))),
    thread,
  )
}
export const saveToFileIndex$ = () =>
  cache(
    ({ fileName }) => fileName,
    async file => {
      /**
       * @type {string}
       */
      const id = await saveToFileIndex(file)
      return id
    },
  )

const result$ = store.pipe(
  download$(thread),
  flatMap(({ key, file }) => {
    return of(file).pipe(
      saveToFileIndex$(),
      map(
        /**
         * @param {string} id
         */
        id => ({ key, id }),
      ),
    )
  }, 1),
  publishReplay(),
  refCount(),
)

from([
  result$.pipe(
    scan(
      /**
       * @param {number} acc
       * @param {{ key: string; id: string; }} _
       *
       * @returns {number}
       */
      // eslint-disable-next-line no-unused-vars
      (acc, _) => ++acc,
      0,
    ),
  ),
  store.pipe(scan(acc => ++acc, 0)),
])
  .pipe(combineAll())
  .subscribe(([curr, total]) => {
    if ((curr * 10) % total === 0) {
      // eslint-disable-next-line no-console
      console.log(`任务进度: ${(curr / total) * 100}% 总任务数: ${total}`)
    }
  })

/**
 * @param {string} url
 *
 * @returns {import('rxjs').Observable<string>} fileIndexId
 */
export const downloadManage = url => {
  const md5 = randomMd5()
  store.next({ key: md5, url })
  return result$.pipe(
    filter(({ key }) => key === md5),
    first(),
    pluck('id'),
  )
}
