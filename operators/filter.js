import { SIG_START, SIG_DATA, SIG_END } from '../SIGNALS'

const filter = pred => source => (signal, sink) => {
  if (signal !== SIG_START) return
  let talkback = null
  source(SIG_START, (signal, payload) => {
    if (signal === SIG_START) {
      talkback = payload
      sink(signal, payload)
    } else if (signal === SIG_DATA) {
      if (pred(payload)) {
        sink(signal, payload)
      } else {
        talkback(SIG_DATA)
      }
    } else {
      sink(signal, payload)
    }
  })
}

export default filter
