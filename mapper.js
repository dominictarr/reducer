//reducer manages reduce groups.
module.exports = function (map, reducer) {

  //emit needs to pass value
  // to a reduce group
  // NOTE: value must have an id.
  return {
    write: function (item) {
     function emit(key, value) {
       var id = item.id
       reducer.write({group: key, id: item.id, value: value})
     }
     map.call({emit: emit}, item.value) 
    }

  }
}
