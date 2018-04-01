const RESPONSE_SERVER = 'vas-stats/0.0.1'
const CONTENT_TYPE = 'application/json;charset=utf-8'

exports.okJsonRes = (response) => {
  response.status = 200
  response.setHeader({
    'Content-Type': CONTENT_TYPE,
    'Server': RESPONSE_SERVER,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,invocation-protocol'
    // HEAD,OPTIONS,GET,POST,PUT,DELETE
  })
}

exports.bodyToString = function (body) {
  return body.read().toString()
}
