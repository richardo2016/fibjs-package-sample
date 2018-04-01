const fs = require('fs')
const path = require('path')

let env = require('./_env')
let envs = {}
try {
  envs = require('./.env.rc.jsc')
} catch (e) {
  console.warn(`require .env.rc.jsc failed, make sure it exits!`)
}

if (envs.hasOwnProperty(env)) {
  try {
    fs.unlink(path.join(__dirname, '../../.env.rc.jsc'))
  } catch (error) {}
}
envs.alpha = require('./alpha')

if (!envs.hasOwnProperty(env)) {
  console.warn(`[fibjs:app:warning] unknown env named '${env}', it's corrected to alpha`)
  env = 'alpha'
}

const cfg = envs[env]
console.info('[fibjs:conf:envs]', JSON.stringify(cfg, null, ''))

module.exports = cfg
