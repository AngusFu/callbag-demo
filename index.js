import pipe from './pipe'

import interval from './source/interval'
import fromPromise from './source/fromPromise'

import forEach from './sink/forEach'

import map from './operators/map'
import filter from './operators/filter'
import take from './operators/take'

export default {
  pipe,

  interval,
  fromPromise,

  forEach,

  map,
  filter,
  take
}
