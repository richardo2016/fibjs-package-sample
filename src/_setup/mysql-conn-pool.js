const db = require('db')
const Pool = require('fib-pool')
const cfg = require('../conf')

function getDbConn () {
  let myDB = null
  try {
    myDB = db.openMySQL(cfg.mysql.dal)
  } catch (error) {
    console.info('[fibjs:db:mysql] connect mysql error', error)
  }

  return myDB
}

const pool = Pool({
  create: () => {
    console.info('[fibjs:db:mysql]on Pool Create', pool.info())
    return getDbConn()
  },
  destroy: (o) => {
    console.info('[fibjs:db:mysql]on Pool Destroed.')
    o.closeSync()
  },
  maxsize: 10,
  timeout: 30 * 1000, // set timeout as 30s
  retry: 3
})

module.exports = pool
