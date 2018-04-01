const http = require('http')
const querystring = require('querystring')
const { formatLog } = require('./logger')

exports.parseJsonBody = (req) => {
  try {
    const bodyStream = req.body.readSync()
    if (!bodyStream) {
      return {}
    }

    const rawBody = bodyStream.toString()
    return JSON.parse(rawBody)
  } catch (e) {
    console.log(
      formatLog('error', 'parseJsonBody', e)
    )
    return {}
  }
}
