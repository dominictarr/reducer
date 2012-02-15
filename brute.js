var u = require('ubelt')

module.exports = function (reduce, initial) {

  var cache = {}
  var exports = {}
  var collection = initial  
  //{id: ID, key: key, value: value)
  exports.write = function (data) {
    if(data.delete) delete cache[data.id]
    else cache[data.id] = data
  }

  /*
    it simplifies the code for group 2 if there is no initial value
    initial value is the first item. 
    if there is only one item then the reduce is not called.
  */

  exports.reduce = function () { //callback?
    //var collection = (initial == null ? [] : initial)
    var first = true
    u.each(cache, function (v) {
      if(first) first = false, collection = reduce(initial, v.value)
      else collection = reduce(collection, v.value)
    })

    return collection
  }

  return exports
}