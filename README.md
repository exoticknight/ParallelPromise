# ParallelPromise

run promises with timeout, in parallel

> you can alse check [serial-promise](https://www.npmjs.com/package/serial-promise)

## Install

```bash
npm install parallel-promise --save
```

## Usage

```javascript
import ParallelPromise, { StatusCode } from 'parallel-promise'

ParallelPromise(
  [
    () => {
      // return a promise that resolves in 100ms
    },
    () => {
      // return a promise that resolves in 3000ms
    },
    () => {
      // return a promise that rejects in 100ms
    },
    () => {
      // return a promise that rejects in 3000ms
    },
  ],
  [1000, 2000, 1000, 2000],
  (progress) => {
    // called whenever a promise's state is changed
    // progress == {
    //   total: 4,  total count of promise
    //   resolve: [],  array of the index of the resolved promises
    //   reject: [],  array of the index of the rejected promises
    //   timeout: [],  array of the index of the timeouted promise
    // }
  }
).then(rets => {
  // after 2000ms
  // rets == [
  //   { status: StatusCode.RESOLVE, data:[your data] },
  //   { status: StatusCode.TIMEOUT, timeout: 2000 }
  //   { status: StatusCode.REJECT, err:[error] },
  //   { status: StatusCode.TIMEOUT, timeout: 2000 }
  // ]
})// NOTE that there is not .catch here
```

You can use async/await as well.

## StatusCode

| Status | StatusCode |
|---|---|
| RESOLVE | 0 |
| REJECT | 1 |
| TIMEOUT | -1 |

## Test

```bash
npm run test
```

## License

MIT