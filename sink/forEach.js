
const forEach = operation => producer => {
  let talkback = null

  // 1. Greets the producer with a sink function
  producer(SIG_START, (signal, payload) => {
    // 3. started
    if (signal === SIG_START) {
      talkback = payload
    }

    if (signal === SIG_DATA) {
      operation(payload)
    }

    if (signal === SIG_DATA || signal === SIG_START) {
      talkback(SIG_DATA)
    }
  })
}

export default forEach
