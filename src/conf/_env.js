let env = process.env.NODE_ENV || process.env.FIB_ENV || 'alpha'
switch (env) {
  case 'development':
  case 'develop':
  case 'dev':
    env = 'alpha'
    break
  case 'production':
  case 'prod':
    env = 'production'
}
console.warn(`[fibjs:app:log]attempt to get cfg from env: ${env}`)

module.exports = env
