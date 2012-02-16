
/*
  each group feeds into a parent group
  the id of the write to the parent group is 
  just the child's group key.

  if the key is an array, then the parent group is the key.pop()
*/

var a = require('assertions')

var validOpts = 
  a._has({
    type: a._includes(['smart', 'brute', 'unreduce']
          , 'must have valid type'),
    reduce: function (actual) {
      if('object' == typeof actual) {
        a.has(actual, {reduce: a._isFunction(), unreduce: a._isFunction()}
        , 'must have reduce and unreduce if unreduce type')
      } else
        a.isFunction(actual
        , 'must pass reduce function')
      //HMM, ADD AN or AND xor AND and ASSERTION.
    },
    initial: a._notStrictEqual(undefined, 'must pass an initial value')
  })

module.exports = 
function (opts) {

  validOpts(opts)

  var reduce = opts.reduce
  var initial = opts.initial
  var type = require('./'+opts.type)
  var emit = opts.emit

  function newGroup(k, p) {
    console.log('new group', k)
    var g = type(reduce, initial)
    g.key = k
    g.parent = Array.isArray(k) && k.length ? k.slice(0, k.length - 1) : p
    if('' + g.parent === '') 
      g.parent = '*'
    return g
  }

  var groups = {}
  var queue = []

  return {
    write: function (data) {
      //if there is not a group for this key, create one
      var k = data.key
      var g = groups[k] = groups[k] || newGroup(k, k == '*' ? null : '*')
      g.write(data) //will ignore the key
      if(!~queue.indexOf(g))
        queue.push(g)
    },
    reduce: function () {
      var write = this.write
      while(queue.length) {
        var v = queue.shift()
        var r = v.reduce()
        //stop when you get to the top level group
        var data = {id: v.key, key: v.parent, value: r}
        if(v.parent) write(data)
        //this console.log will stand in for emit, for now.
        emit(data)
      }
    }
  }
}

