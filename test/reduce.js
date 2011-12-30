
var a = require('assertions')
  , bruteforce = require('../group')
  , smart      = require('../group2')
  , unreduce   = require('../group3')

function testReduce(g) {

  g.write({id: 0, value: 1})
  g.write({id: 1, value: 3})
  g.write({id: 5, value: 2.5})
  g.write({id: 7, value: 1.5})
  g.write({id: 2, value: 2})

  var r = g.reduce()

  a.equal(r, 10)

  //update one id, but shouldn't have to recalculate all the reduces
  
  g.write({id: 2, value: 3})
  var r = g.reduce()

  a.equal(r, 11)

  g.write({id: 7, value: 0.5})
  g.write({id: 6, value: 5})

  var r = g.reduce()

  a.equal(r, 15)

  g.write({id: 9, value: 5})
  var r = g.reduce(sum, 0)
  a.equal(r, 20)

  g.write({id: 0, value: 3})
  g.write({id: 1, value: 6})

  var r = g.reduce()
  
  a.equal(r, 25)
  
  //what about deletes?
  
  g.write({id: 9, delete: true})
  
  var r = g.reduce()
  a.equal(r, 20)
  
}

/*
  three different reduce algorithms.
  
  bruteforce 
    just reruns the whole reduce each time there is an update.

  smart
    caches map reduces in a tree, and only needs to run a maxium of sqrt(N) 
    reduces when an update occurs
  
  unreduce reduce
    certain reduce functions are reversable, (example, sum and count are reversable, max is not)
    on update this algorithm reverses the old value, then computes the new value.

*/


function sum (col, v) {
  console.error('reduce:', col, '+', v)
  return col + v
}

exports['brute force rereduce'] = function () {
  var g = bruteforce(sum, 0)
  testReduce(g, sum)
}

exports['smart rereduce'] = function () {
  var g = smart(sum, 0)
  testReduce(g, sum)
}

exports['reduce unreduce'] = function () {
  var g = unreduce ({ 
            reduce: sum
          , unreduce: 
            function (col, v) {
              console.error('unreduce:', col, '-', v)
              return col - v  
            }
          }, 0)
  testReduce(g)
}

function max (max, v) {
  return max > v ? max : v
}

function testMax (g, values, expected) {

  values.forEach(function (v, k) {
    g.write({id: k, value: v})  
  })
  a.equal(g.reduce(), expected)
}

/*
  this is getting into territory where i'll probably want 
  to distinguish between combine and initial steps.
  
  if a combined object is the same form it doesn't matter,
  if it's different, then maybe it does.

  should i use initial?

*/

exports['bruteforce reduce - initial'] = function () {

  testMax(bruteforce(max, 0), [1,2,3], 3)
  testMax(bruteforce(max, 4), [1,2,3], 4) // 4 or greater

}

exports['smart reduce - initial'] = function () {

  testMax(smart(max, 0), [1,2,3], 3)
  testMax(smart(max, 4), [1,2,3], 4) // 4 or greater

}
