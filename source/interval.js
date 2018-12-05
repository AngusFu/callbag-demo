import { SIG_START, SIG_DATA, SIG_END } from '../SIGNALS'

const interval = period => (signal, sink) => {
  // A callbag MUST NOT be delivered data before it has been greeted
  if (signal !== SIG_START) return

  let i = 0
  const tick = () => sink(SIG_DATA, i++)
  const tid = setInterval(tick, period)

  const talkback = signal => {
    // terminating
    if (signal === SIG_END) {
      clearInterval(tid)
    }
  }

  // 2. Handshake with consumer (ie greets the consumer)
  sink(SIG_START, talkback)
}

export default interval
