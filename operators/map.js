import { SIG_START, SIG_DATA, SIG_END } from '../SIGNALS'

const map = operation => source => (signal, sink) => {
  if (signal !== SIG_START) return
  const talkback = (signal, payload) => {
    sink(signal, signal === SIG_DATA ? operation(payload) : payload)
  }
  source(SIG_START, talkback)
}

export default map

