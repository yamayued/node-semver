'use strict'

const { test } = require('tap')
const satisfies = require('../../functions/satisfies')
const rangeInclude = require('../fixtures/range-include.js')
const rangeExclude = require('../fixtures/range-exclude.js')
test('range tests', t => {
  t.plan(rangeInclude.length)
  rangeInclude.forEach(([range, ver, options]) =>
    t.ok(satisfies(ver, range, options), `${range} satisfied by ${ver}`))
})

test('negative range tests', t => {
  t.plan(rangeExclude.length)
  rangeExclude.forEach(([range, ver, options]) =>
    t.notOk(satisfies(ver, range, options), `${range} not satisfied by ${ver}`))
})

test('invalid ranges never satisfied (but do not throw)', t => {
  const cases = [
    ['blerg', '1.2.3'],
    ['git+https://user:password0123@github.com/foo', '123.0.0', true],
    ['^1.2.3', '2.0.0-pre'],
    ['0.x', undefined],
    ['*', undefined],
  ]
  t.plan(cases.length)
  cases.forEach(([range, ver]) =>
    t.notOk(satisfies(ver, range), `${range} not satisfied because invalid`))
})

test('issue #906 regression tests', t => {
  t.plan(4)
  t.ok(satisfies('1.2.3-alpha', '1.2.3-alpha'), '1.2.3-alpha satisfied by 1.2.3-alpha')
  t.notOk(satisfies('1.2.3-alpha', '*'), '1.2.3-alpha NOT satisfied by *')
  t.ok(satisfies('1.2.3-alpha', '* || 1.2.3-alpha'), '1.2.3-alpha satisfied by * || 1.2.3-alpha')
  t.ok(satisfies('1.2.3-alpha', '1.2.3-alpha || *'), '1.2.3-alpha satisfied by 1.2.3-alpha || *')
})
