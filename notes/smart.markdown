
send stream of items to map then to a reduce.

map (doc, id) 
  this.emit(key, value)
  
reduce (collection, value)
  collection.push(value)
  returns collection
  
documents are written to the m-r server as key value pairs

{id: id, value: value...}

then mapped to

each write to the reduce must have:

{key: mKey, id: id, mValue}

then, each key is reduced down to a single value.
if a id is updated, the reduce that is part of must be recalculated.

```
key   id   value
red    1       3
red    2       5
red    3       6

reduce (sum, value) {
  return sum + value
}
```
... a function like that may procede iteratively.

if say, id=2 is updated, then the whole reduction must be recalculated.

(naive way: start over)
(clever, interesting way: store values in tree and just recalc branches)

tree by ID:
```
a
b ab
c
d cd (ab-cd)
e
f ef       ((ab-cd)-ef)

will need to know what reductions each id is a part of.
a -> ab
ab -> (ab-cd)
(ab-cd) -> ((ab-cd)-ef)
```
will also need to know what sources must be used to recalculate each reduction.
it's also necessary to recalculate each branch by . . . 
such a much harder problem than brute-forcing it.
but that is what makes this interesting.

oh... when a is updated,

``` js
update (key) {
  var value = cache[key]
  if(value.partof) {
    var child = update(cache[key].partof)
    child.from.forEach(function (k) {
      if(!~rereduce.indexOf(cache[k])) 
        rereduce.push(cache[k])
      cache[k]
    })
  } else if(value.from) {
    cache[key] = null 
    //delete this object from the cache.
    value.delete = true
    //mark it as deleted, 
    //incase it has already been added to the reduce queue
    //(could happen if more than one value is updated)
    //when reducing, just skip things that where marked with delete
  }
}
```

if a is part of a further reduction:
  apply this ru
remove a's reduction,
from the cache (recursively)

``` js
a: {value: {...}, id: a, partof: 'ab'}
b: {value: {...}, id: b, partof: 'ab'}
ab:{value: reduce(a,b) id: ab, partof: (ab-cd), from: [a,b]}
``` 

run the rereduce now or soon.

that is the cache by id, what about by reduce group?

ah, it's easy. after completing the rereduce queue, the reduction for that group is complete.
