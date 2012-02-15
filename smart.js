
module.exports = function (reduce, initial) {

  var cache = {}
  var queue = []
  var garbage = []
  var exports = {cache: cache}
  var head = null

  function enqueue (data) {
    if(!~queue.indexOf(data) && ! data.delete)
      queue.push(data)
  }

  function update (data) {
    //queue.push(data)
    var id = data.id
    var value = cache[id]
    if(value) {
      if (value.value !== data.value) value.value = data.value
      if (data.delete) value.delete = true
    }
    if(!value) {
      cache[id] = data
      enqueue(data)
    } else if(value.partof) {
      //if this node has a reduction, update it's reduction.
      var child = cache[cache[id].partof]
      child.delete = true
      //enqueue this node's siblings if they arn't already.
      child.from.forEach(function (k) { enqueue(cache[k]) })
      //also, update the children of this node
      update(child)
      garbage.push(child.id)
    }
  }

  exports.write = function (data) {
    update(data)
  }

  function uid () {
    return Math.random()
  }
  function collectGarbage () {
    while(garbage.length)
      delete cache[garbage.shift()]
  }
  
  exports.reduce = function () { //callback?
    //remove old middle values
    collectGarbage()
    if(head) enqueue(head)
    while (queue.length >= 2) {
      var left = queue.shift()
      var right = queue.shift()
      var id = uid()
      var lValue = (!left.from) ? reduce(initial, left.value) : left.value
      var rValue = reduce(lValue, right.value)

      console.error('reduce(', left.value, ',', right.value, ') =', rValue, lValue)

      var r = head = {
        id: id
      , value: rValue 
      , from: [left.id, right.id]
      }
      
      right.partof = left.partof = id
      
      cache[id] = r
      queue.push(r)
    }
    return (queue.shift() || head).value
  }
  return exports
}
