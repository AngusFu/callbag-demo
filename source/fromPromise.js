import { SIG_START, SIG_DATA, SIG_END } from '../SIGNALS'

const fromPromise = promise => (start, sink) => {
  if (start !== SIG_START) return

  let ended = false

  const onfulfilled = val => {
    if (ended) return

    sink(SIG_DATA, val)

    if (ended) return
    sink(SIG_END)
  }

  const onrejected = err => {
    if (ended) return
    sink(SIG_END, err)
  }

  promise.then(onfulfilled, onrejected)

  sink(SIG_START, t => {
    if (t === SIG_END) ended = true
  })
}

export default fromPromise
