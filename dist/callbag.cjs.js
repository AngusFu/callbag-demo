'use strict';

const pipe = (fst, ...rest) => {
  let result = fst;
  for (let i = 0; i < rest.length; i++) {
    result = rest[i](result);
  }
  return result
};

const SIG_START$1 = 0;
const SIG_DATA$1 = 1;
const SIG_END = 2;

const interval = period => (signal, sink) => {
  // A callbag MUST NOT be delivered data before it has been greeted
  if (signal !== SIG_START$1) return

  let i = 0;
  const tick = () => sink(SIG_DATA$1, i++);
  const tid = setInterval(tick, period);

  const talkback = signal => {
    // terminating
    if (signal === SIG_END) {
      clearInterval(tid);
    }
  };

  // 2. Handshake with consumer (ie greets the consumer)
  sink(SIG_START$1, talkback);
};

const fromPromise = promise => (start, sink) => {
  if (start !== SIG_START$1) return

  let ended = false;

  const onfulfilled = val => {
    if (ended) return

    sink(SIG_DATA$1, val);

    if (ended) return
    sink(SIG_END);
  };

  const onrejected = err => {
    if (ended) return
    sink(SIG_END, err);
  };

  promise.then(onfulfilled, onrejected);

  sink(SIG_START$1, t => {
    if (t === SIG_END) ended = true;
  });
};

const forEach = operation => producer => {
  let talkback = null;

  // 1. Greets the producer with a sink function
  producer(SIG_START, (signal, payload) => {
    // 3. started
    if (signal === SIG_START) {
      talkback = payload;
    }

    if (signal === SIG_DATA) {
      operation(payload);
    }

    if (signal === SIG_DATA || signal === SIG_START) {
      talkback(SIG_DATA);
    }
  });
};

const map = operation => source => (signal, sink) => {
  if (signal !== SIG_START$1) return
  const talkback = (signal, payload) => {
    sink(signal, signal === SIG_DATA$1 ? operation(payload) : payload);
  };
  source(SIG_START$1, talkback);
};

const filter = pred => source => (signal, sink) => {
  if (signal !== SIG_START$1) return
  let talkback = null;
  source(SIG_START$1, (signal, payload) => {
    if (signal === SIG_START$1) {
      talkback = payload;
      sink(signal, payload);
    } else if (signal === SIG_DATA$1) {
      if (pred(payload)) {
        sink(signal, payload);
      } else {
        talkback(SIG_DATA$1);
      }
    } else {
      sink(signal, payload);
    }
  });
};

const take = count => source => (signal, sink) => {
  if (signal !== SIG_START$1) return

  let taken = 0;
  let talkback = null;

  source(SIG_START$1, (signal, payload) => {
    if (signal === SIG_START$1) {
      talkback = payload;

      sink(SIG_START$1, (signal, payload) => {
        if (taken < count) {
          talkback(SIG_DATA$1, payload);
        }
      });

      return
    }

    if (signal === SIG_DATA$1) {
      taken++;
      sink(signal, payload);

      if (taken >= count) {
        sink(SIG_END);
        talkback(SIG_END);
      }

      return
    }

    sink(signal, payload);
  });
};

var index = {
  pipe,

  interval,
  fromPromise,

  forEach,

  map,
  filter,
  take
};

module.exports = index;
