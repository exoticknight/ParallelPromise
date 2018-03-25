import ParallelPromise, { StatusCode } from '../src/index'
import 'mocha'
import { expect } from 'chai'

function generatePromise(isRes, timeout) {
  return () => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (isRes) {
          res()
        } else {
          rej()
        }
      }, timeout)
    })
  }
}

describe('resolve before timeout', function() {
  it('should resolve', async function() {
    const rets = await ParallelPromise(
      [generatePromise(true, 100)],
      [1000],
      x => x
    )

    expect(rets[0].status).to.eq(StatusCode.RESOLVE)
  })
})

describe('reject before timeout', function() {
  it('should reject', async function() {
    const rets = await ParallelPromise(
      [generatePromise(false, 100)],
      [1000],
      x => x
    )

    expect(rets[0].status).to.eq(StatusCode.REJECT)
  })
})

describe('resolve but timeout', function() {
  it('should timeout', async function() {
    const rets = await ParallelPromise(
      [generatePromise(true, 2000)],
      [1000],
      x => x
    )

    expect(rets[0].status).to.eq(StatusCode.TIMEOUT)
  })
})

describe('reject but timeout', function() {
  it('should timeout', async function() {
    const rets = await ParallelPromise(
      [generatePromise(false, 2000)],
      [1000],
      x => x
    )

    expect(rets[0].status).to.eq(StatusCode.TIMEOUT)
  })
})