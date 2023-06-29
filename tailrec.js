class Tail {
  constructor(f, args) {
    this.f = f
    this.args = args
  }
}

const tailrec = (f) => {
  const ret = (...args) => {
    let v = f(...args)
    while (v instanceof Tail) {
      v = v.f(...v.args)
    }
    return v
  }
  ret.tail = (...args) => {
    return new Tail(f, args)
  }
  return ret
}

export default tailrec
