'use strict'

const safe = require('../')
const { test } = require('node:test')

const good = [
  /\bOakland\b/,
  /\b(Oakland|San Francisco)\b/i,
  /^\d+1337\d+$/i,
  /^\d+(1337|404)\d+$/i,
  /^\d+(1337|404)*\d+$/i,
  RegExp(Array(26).join('a?') + Array(26).join('a'))
]

test('safe regex', t => {
  t.plan(good.length)
  good.forEach(function (re) {
    t.assert.strictEqual(safe(re), true)
  })
})

const bad = [
  /^(a?){25}(a){25}$/,
  RegExp(Array(27).join('a?') + Array(27).join('a')),
  /(x+x+)+y/,
  /foo|(x+x+)+y/,
  /(a+){10}y/,
  /(a+){2}y/,
  /(.*){1,32000}[bc]/
]

test('unsafe regex', t => {
  t.plan(bad.length)
  bad.forEach(function (re) {
    t.assert.strictEqual(safe(re), false)
  })
})

const invalid = [
  '*Oakland*',
  'hey(yoo))',
  'abcde(?>hellow)',
  '[abc'
]

test('invalid regex', t => {
  t.plan(invalid.length)
  invalid.forEach(function (re) {
    t.assert.strictEqual(safe(re), false)
  })
})
