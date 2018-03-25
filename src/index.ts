export interface PromiseGenerator {
  ():Promise<any>
}

export type Progress = {
  total:number
  resolve:number[]
  reject:number[]
  timeout:number[]
}

export interface IOnProgress {
  (value:Progress): void
}

export enum StatusCode {
  RESOLVE = 0,
  REJECT = 1,
  TIMEOUT = -1,
}

type ResolveResult = {
  status:StatusCode.RESOLVE
  data:any
}

type RejectResult = {
  status:StatusCode.REJECT
  error:any
}

type TimeoutResult = {
  status:StatusCode.TIMEOUT
  timeout:number
}

interface Resolver {
  (result:ResolveResult|RejectResult|TimeoutResult):void
}

export default function ParallelPromise(
    promises:PromiseGenerator[],
    timeouts:number[]=[],
    onProgress:IOnProgress=x=>x
  ):Promise<any> {

  const totalCount = promises.length
  const resolveQueue = []
  const rejectQueue = []
  const timeoutQueue = []

	const rets = promises.map((e:PromiseGenerator, i) => {
		let ret
		if (timeouts[i]) {
      let timeoutHandler
      let end = false
			ret = [
        new Promise((resolve:Resolver) => {
          timeoutHandler = setTimeout(() => {
            if (!end) {
              end = true
              timeoutQueue.push(i)
              onProgress({
                total: totalCount,
                resolve: resolveQueue.slice(0),
                reject: rejectQueue.slice(0),
                timeout: timeoutQueue.slice(0),
              })
              resolve({ status: StatusCode.TIMEOUT, timeout:timeouts[i] })
            }
          }, timeouts[i])
        }),
        new Promise((resolve:Resolver) => {
          e().then(d => {
            if (!end) {
              end = true
              clearTimeout(timeoutHandler)
              resolveQueue.push(i)
              onProgress({
                total: totalCount,
                resolve: resolveQueue.slice(0),
                reject: rejectQueue.slice(0),
                timeout: timeoutQueue.slice(0),
              })
              resolve({ status: StatusCode.RESOLVE, data: d })
            }
          }).catch(d => {
            if (!end) {
              end = true
              clearTimeout(timeoutHandler)
              rejectQueue.push(i)
              onProgress({
                total: totalCount,
                resolve: resolveQueue.slice(0),
                reject: rejectQueue.slice(0),
                timeout: timeoutQueue.slice(0),
              })
              resolve({ status: StatusCode.REJECT, error: d })
            }
          })
        }),
      ]
		} else {
      ret = [
        new Promise((resolve:Resolver) => {
          e().then(d => {
            resolveQueue.push(i)
            onProgress({
              total: totalCount,
              resolve: resolveQueue.slice(0),
              reject: rejectQueue.slice(0),
              timeout: timeoutQueue.slice(0),
            })
            resolve({ status: StatusCode.RESOLVE, data: d })
          }).catch(d => {
            resolveQueue.push(i)
            onProgress({
              total: totalCount,
              resolve: resolveQueue.slice(0),
              reject: rejectQueue.slice(0),
              timeout: timeoutQueue.slice(0),
            })
            resolve({ status: StatusCode.REJECT, error: d })
          })
        })
      ]
    }
		return Promise.race(ret)
	})

	return Promise.all(rets)
}