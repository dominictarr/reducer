
var reducers = {
  brute: require('./brute'),
  smart: require('./smart'),
  unreduce: require('./unreduce')
}
//get the basics right with a brute force implementation.

function MapReduce (opts) {

  if(!(this instanceof MapReduce)) return new MapReduce(opts)

  opts = opts || {} 
  var reduce
  var type = reducers[opts.unreduce ? 'unreduce' : (opts.type || 'smart')]
  if (
    type === reducers.unreduce 
    && !opts.unreduce 
  ) 
    throw new Error('unreduce function required')
  
  reduce = opts.unreduce 
    ? {reduce: opts.reduce, unreduce: opts.unreduce}
    : opts.reduce

  function newGroup () {
    return type(reduce, opts.initial)
  }

  
}

MapReduce.prototype.set = function (key, value) {
  
}


module.exports = function () {
  
}
