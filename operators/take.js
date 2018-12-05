import { SIG_START, SIG_DATA, SIG_END } from '../SIGNALS'

const take = count => source => (signal, sink) => {
  if (signal !== SIG_START) return

  let taken = 0
  let talkback = null

  source(SIG_START, (signal, payload) => {
    if (signal === SIG_START) {
      talkback = payload

      sink(SIG_START, (signal, payload) => {
        if (taken < count) {
          talkback(SIG_DATA, payload)
        }
      })

      return
    }

    if (signal === SIG_DATA) {
      taken++
      sink(signal, payload)

      if (taken >= count) {
        sink(SIG_END)
        talkback(SIG_END)
      }

      return
    }

    sink(signal, payload)
  })
}

export default take
