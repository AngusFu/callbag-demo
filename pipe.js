const pipe = (fst, ...rest) => {
  let result = fst
  for (let i = 0; i < rest.length; i++) {
    result = rest[i](result)
  }
  return result
}

export default pipe
