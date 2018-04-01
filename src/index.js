const http = require('http')
const db = require('db')
const util = require('util')
const coroutine = require('coroutine')

const cfg = require('./conf')
const pug = require('fib-pug')

let mysqlConnector = null

function tryConn () {
  try {
    mysqlConnector = util.sync(db.openMySQL)(cfg.mysql.dal)
  } catch (error) {
    mysqlConnector = null
    console.info('[fibjs:app:mysqlConnector:error] connect failed', error)
    return
  }
  console.info('[fibjs:app:mysqlConnector:ok] connect success')
}
tryConn()

function testMysqlHandler (req) {
  // let sql = 'show tables'
  let limit = parseInt(req.query.limit) || 10
  let sql = 'select * from you_table limit 0, ?'
  let res = null
  try {
    if (!mysqlConnector) {
      okJsonRes(req.response)
      req.response.write(JSON.stringify({error: 'bad mysqlConnector'}))
      tryConn()
      return
    }

    res = mysqlConnector.execute(sql, limit)
    // console.info('mysql res', res, sql)
    okJsonRes(req.response)
    req.response.write(JSON.stringify(res))
  } catch (error) {
    console.info('[fibjs:stats/mysql:error], mysql query error', error)
    okJsonRes(req.response)
    req.response.write(JSON.stringify({error: 'error occured'}))
  }
}

const { okJsonRes } = require('./utils/response')
const { parseJsonBody } = require('./utils/request')

console.log('[fibjs:app] starting')

const svr = new http.Server(3001, {
  '^/$': (req) => {
    okJsonRes(req.response)
    req.response.write(JSON.stringify({status: 'fibsjs app'}))
  },
  '^/hello/(.*)$': (req, name) => {
    okJsonRes(req.response)
    req.response.write('hello, ' + name)
  },
  '^/ping$': (req) => {
    okJsonRes(req.response)
    req.response.write(JSON.stringify({status: 'ok'}))
  },
  '^/test-mysql$': testMysqlHandler,
  '^/pug$': (req) => {
    okJsonRes(req.response)
    const bodyJson = parseJsonBody(req) || {}
    const rawText = bodyJson.raw || req.query.raw
    if (!rawText) {
      req.response.write(
        JSON.stringify({
          html: '',
          error: 'no input for pug'
        })
      )
      return
    }

    const { pretty = true } = bodyJson || {}

    let html = ''
    let error = null
    try {
      html = pug.compile(rawText, {pretty})();
    } catch (e) {
      html = ''
      error = e.message
    }

    req.response.write(
      JSON.stringify({
        html: html,
        ...error && {error: error}
      })
    )
  },
  '*': (req) => {
    okJsonRes(req.response)
    req.response.write(JSON.stringify({status: '404'}))
  }
})

console.log('[fibjs:app] started')
coroutine.start(() => {
  while (!mysqlConnector) {
    tryConn()
    coroutine.sleep(1000)
  }
})
svr.run()
