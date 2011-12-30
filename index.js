

//get the basics right with a brute force implementation.

var cache = {}
  , queue = []

//id    - strict identity for this value
//key   - key for reduce target.
//value - value to be passed to reduce function.

function addDoc(id, key, value) {

  var cur = cache[id] = {value: value, id: id, key: key}
  
  queue.push(cur)
  
  // will need a hash of keys, but ignore that for now.

}

function go(reduce, initial) {
  //solve the reduce queue
  if(queue.length == 1)
    return queue.shift()
  
  initial
  var b = queue.shift()
  
  reduce(a, b)
}

module.exports = function () {
  
}
