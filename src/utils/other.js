import * as R from 'ramda'
import { Observable, from, of } from 'rxjs'
import { mergeAll, map, mergeMap } from 'rxjs/operators'

/**
 * @param {(key: string,parent:any) => any} asyncFn
 * @param {Object} data
 * @param {[import('rxjs').Observable<any>]} observables
 */
export function _asyncMap(asyncFn, data, observables) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const result = asyncFn(key, data)
      if (result instanceof Observable) {
        observables.push(result)
      } else if (result instanceof Promise) {
        observables.push(from(result))
      }

      if (R.is(Object)(data[key])) {
        _asyncMap(asyncFn, data[key], observables)
      }
    }
  }

  return data
}
/**
 * @param {(key: string,parent:any) => any} asyncFn
 * @param {Object} data
 * @returns {Promise<any>}
 */
export async function asyncMap(asyncFn, data) {
  const tempData = R.clone(data)
  /** @type {[Observable<any>]} */
  // @ts-ignore
  let observables = []
  // @ts-ignore
  _asyncMap(asyncFn, tempData, observables)

  await from(observables)
    .pipe(mergeAll())
    .toPromise()
  return tempData
}
/**
 * 将数组按个数分组
 *
 * @param {number} n
 * @param {Array} list
 * @returns {Array}
 */
function group(n, list) {
  return R.isEmpty(list)
    ? []
    : R.prepend(R.take(n, list), group(n, R.drop(n, list)))
}

export const groupsOf = R.curry(group)

/**
 * 将上游的数据以 {key,value} 的形式缓存,通过 key 区分数据
 *
 * 如果缓存中不存在,则运行生成函数获取数据,放入缓存,并传递给下游
 *
 * 如果存在,则直接从缓存中索引数据,传入下游
 *
 * @param {(value: any) => string} keySelector 可选函数,设定缓存的 key
 * @param {(value: any) => Promise<any>|Observable<any>} project 可选函数,value 生成函数,返回 Promise 或者流
 */
export function cache(keySelector = v => v, project = v => of(v)) {
  const values = new Map()
  /**
   * @param {Observable<any>} source
   */
  function cacheOperator(source) {
    return source.pipe(
      mergeMap(value => {
        const key = keySelector(value)
        if (!values.has(key)) {
          const result = from(project(value)).pipe(
            map(v => {
              values.set(key, v)
              return v
            }),
          )
          return result
        } else {
          return of(values.get(key))
        }
      }, 1),
    )
  }
  return cacheOperator
}
