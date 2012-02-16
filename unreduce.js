var u = require('ubelt')

 /*
    in some cases reduce is reversable, 
    sum, avg, count, etc
    which means it's not necessary to 
    rereduce anything.

    just unreduce the old value, then reduce the new...

    min, max, etc are not unreducable.
  */

module.exports = function (reduce, initial) {

  var cache = {}
  var exports = {}
  var collection = null 
  var updates = []
  var first = null
  //{id: ID, key: key, value: value)
  exports.write = function (data) {
    updates.push(data)
  }

   exports.reduce = function () { //callback?

    while(updates.length) {
      var data = updates.shift()

      if(first === null)
        first = collection = data.value
      else {
        var old = cache[data.id]
        if(old)
          collection = reduce.unreduce(collection, old.value)
        if(!data.delete)
          collection = reduce.reduce(collection, data.value)
      }
      if(data.delete) delete cache[data.id]
      else cache[data.id] = {id: data.id, value: data.value}
    }

    return collection
  }

  return exports
}
