// type: {'log', 'info', 'error', 'debug'}
exports.formatLog = (type = 'log', id = '', content) => {
  return `[fibjslog://${type}/${id}]${content}`
}
