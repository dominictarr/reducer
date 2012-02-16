
var reducer = require('../reducer')
  , a = require('assertions')

//a simple example is a maximum.
function newMax(results) {
var max =
  reducer({
    type: 'smart',
    reduce: function (x, v) {
      if('number' == typeof v)
        v = {min: v, max: v}
      return {
        max: x.max < v.max ? v.max : x.max
      , min: x.min < v.min ? x.min : v.min
      }
    },
    initial: {min: 1/0, max: 0},
    emit: function (v) {
      results[v.id] = v.value
    }
  })

  return max
}
var ids = 0
function write(max, key, values) {
  values.forEach(function (v) {
    max.write({key: key, id: ids++, value: v})
  })
}


exports ['simple groups'] = function () {

  var results = {}
  var max = newMax(results)

  write(max, 'a', [2, 6, 5, 3])
  write(max, 'b', [20, 16, 15, 30])

  max.reduce()

  a.has(results, {
    a:   {min:  2, max:  6},
    b:   {min: 15, max: 30},
    '*': {min:  2, max: 30}
  })
}

exports ['nested groups'] = function () {

  var results = {}
  var max = newMax(results)

  write(max, ['A','1'], [2, 6, 5, 3])
  write(max, ['A','2'], [20, 16, 15, 30])
  write(max, ['B','1'], [7, 3, 8, -3])
  write(max, ['B','2'], [21, 15, 6, 1])

  max.reduce()

  a.has(results, {
    'A,1': {min:  2, max:  6},
    'A,2': {min: 15, max: 30},
    'B,1': {min: -3, max:  8},
    'B,2': {min:  1, max: 21},
    'A'  : {min:  2, max: 30},
    'B'  : {min: -3, max: 21},
    '*'  : {min: -3, max: 30}
  })

  console.log(results)
}
