#reducer

experimental project for a map-reduce server.

I want a node that can incrementally reduce an aggregate, 
even when values change, and so that multiple map reduce 
steps can be chained via a stream interface or zero.mq

## example

suppose you want to calculate the `max` of the following items:

```
[ {id: 'a', value: 2}
, {id: 'b', value: 9}
, {id: 'c', value: 5}
, {id: 'd', value: 6} ]
```
of course, the answer is 'b'.

what if value for 'b' changes? 
the max needs to be recalculated. 
if N is very large, you may want 
to avoid reprocessing the whole set.

this library explores different approaches for efficantly recalculating reduce updates.

## naive

when a value is updated, the entire reduction is recalculated.
it's okay fine to use this when N is small, or you know that each new value is unique.

O(N)

## smart

stores each intermediate value in a tree structure, so that updates can be recalculated
with a minimal amount of recalculation.

on average updates take O(sqrt(N))

## unreduce

sometimes a reduce function is reversable. for example, "sum" and "count" are reversable, 
but "max" and "min" are not.

unreduce first unreduces the old value from the total before adding the new value.

O(1)

# partitioning

naive style:
  hash(key) modulus Number of servers.

but what happens when you want to increase the number of servers?

start with N=1 i.e. send all records to the same server.
give each server a baby sister, and send half the documents to it. 
(check the last bit of the hash, if it is high, send to sister)

then, when you need to add servers, repeat this process for each server,
expect check the next bit. thus, as you add servers number them with binary.

the last bits of each hash is the number of the server that doc should be on.

(run the map, and partition on the mapped key?)

# complexity

so, what order of complexity is this compared to brute force.

brute force is O(N) (N is number of keys)
so if there are 16 items, that is 15 calls to reduce.
and 16 record retrivals.

if it's in a tree.

it's the depth of the tree record retrivals.

if there are 16 items that is only 4 levels.
that it O(sqrt(N)) ... MUCH LESS.

it's also fully paralizable.

# map

how to add a map phase?

```
new MapReducer({
  map: ..., 
  reduce: ...,
  type: smart|brute|unreduce //smart is fine if the groups are small.
  interval: //millseconds to wait before updateing a reducer
})

function map (value) {
  this.emit(key, value)
  //create reduce groups for each distinct key
  //if the key is an array pipe the results to another mapper.
}

```

also, query the map reducer? for raw, mapped, and reduced values
... or just emit reduced values in a stream... or both?


