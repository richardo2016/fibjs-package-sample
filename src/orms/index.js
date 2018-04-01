const orm = require('fib-orm')
const Pool = require('fib-pool')
const cfg = require('../conf')

function getOrms (ormInstance) {
  let myDB = null
  try {
    myDB = orm.connectSync(cfg.mysql.dal)
    myDB.settings.set('connection.pool', true)
  } catch (error) {
    console.info('[fibjs:app] connect mysql error', error)
  }

  // myDB.settings.set('instance.returnAllErrors', true)
  // myDB.settings.set('connection.reconnect', true)
  // myDB.settings.set('connection.debug', true)
  return myDB
}

const pool = Pool({
  create: () => {
    console.info('[fibjs:orm]on Pool Create', pool.info())
    return getOrms()
  },
  destroy: (o) => {
    console.info('[fibjs:orm]on Pool Destroed.')
    o.closeSync()
  },
  maxsize: 10,
  timeout: 30 * 1000, // set timeout as 30s
  retry: 3
})

exports.ormPool = pool
