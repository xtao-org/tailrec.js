import {test} from 'node:test'
import assert from 'node:assert/strict'

import tailrec from "./tailrec.js"

test('mutual unoptimized', () => {
  const even = (n) => {
    if (n === 0) return true
    return odd(n - 1)
  }
  const odd = (n) => {
    if (n === 0) return false
    return even(n - 1)
  }

  assert.equal(even(10000), true)
  assert.equal(odd(10000), false)

  // note: this may stop throwing in some future versions of JS engines if they increase default maximum stack size significantly
  // however we shall get to that if and when it happens

  assert.throws(() => even(100000), /RangeError/)
  assert.throws(() => odd(100000), /RangeError/)

  assert.throws(() => even(1000000), /RangeError/)
  assert.throws(() => odd(1000000), /RangeError/)
})

test('mutual optimized', () => {
  const even = tailrec((n) => {
    if (n === 0) return true
    return odd.tail(n - 1)
  })
  const odd = tailrec((n) => {
    if (n === 0) return false
    return even.tail(n - 1)
  })

  assert.equal(even(10000), true)
  assert.equal(odd(10000), false)

  assert.equal(odd(100000), false)
  assert.equal(even(100000), true)

  assert.equal(odd(1000000), false)
  assert.equal(even(1000000), true)
})
