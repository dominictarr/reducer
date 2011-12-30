

/*
  in more interesting cases, 
  it may be necessary to know wether a function is combining or not.
  
  i mean, joining the results of two reductions...
  
  you could test this by checking the format of the arguments,
  or would it be better to set a third arg?... like how couch db does it?
*/


function average (stats, value) {
  stats.count ++
  stats.sum += value
  stats.mean = stats.sum / stats.count
  stats.sqsum += Math.pow(value,2)
  stats.variance = stats.sqsum / stats.count
  //sample standard deviation
  stats.stdev = Math.sqrt(stats.variance - Math.pow(stats.mean, 2)) / (stats.count - 1 || 1)
}