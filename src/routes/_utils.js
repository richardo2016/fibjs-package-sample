exports.filterLimit = (limitQs, options) => {
  let { min = 10, max = 100 } = options || {}

  let limit = parseInt(limitQs) || min
  if (limit > max) limit = max
  else if (limit < min) limit = min
  else if (isNaN(limit)) limit = min

  return limit
}

exports.filterOrderFlag = (sortString) => {
  let orderSort = '-'
  switch (sortString) {
    case 'asc':
      orderSort = ''
      break
    case 'desc':
    default:
      orderSort = '-'
      break
  }
  return orderSort
}
