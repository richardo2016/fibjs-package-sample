#!/usr/local/bin/fibjs
const test = require('test')
test.setup()

const fs = require('fs')
const io = require('io')
const path = require('path')
const process = require('process')
const zip = require('zip')
const util = require('util')

const vendorExePath = path.join(__dirname, '../vendor/fibjs_bin/fibjs')
const execPath = fs.exists(vendorExePath) ? vendorExePath : process.execPath

function packageRecursively (fileNameList, zf, basepath = '') {
  fileNameList.forEach((filename, index) => {
    var pathInApp = path.join(basepath, filename)

    var stat = fs.stat(path.join(__dirname, '../src', pathInApp))

    console.log('[packaing:fileOrDir]', pathInApp, stat.size)

    if (!stat.size) return

    if (stat.isFile()) {
      var fullPath = path.join(__dirname, '../src', pathInApp)
      var file = fs.openFile(fullPath, 'r')

      if (fullPath.endsWith('.js')) {
        var jscPath = pathInApp.replace('.js', '.jsc')
        var fileRawContent = file.readSync().toString()
        // console.log('fileRawContent', fileRawContent)
        var compiledJsc = util.compile(jscPath, fileRawContent.trim(), 0)
        zf.write(compiledJsc, jscPath)
      } else {
        zf.write(file.readSync(), pathInApp)
      }
    } else if (stat.isDirectory()) {
      var dir = fs.readdir(path.join(__dirname, '../src', pathInApp))
      packageRecursively(dir, zf, pathInApp)
    }
  })
}

module.exports.zipApp = function zipApp () {
  var appPath = path.join(__dirname, '../bin/app') // path.basename(execPath))
  var ms = new io.MemoryStream()
  var zf = zip.open(ms, 'w')

  packageRecursively(fs.readdir(path.join(__dirname, '../src')), zf)

  zf.close()

  ms.rewind()
  try {
    fs.unlink(appPath)
  } catch (e) {}

  // console.info('execPath', execPath)
  fs.copy(execPath, appPath)
  fs.chmod(appPath, 755)
  fs.appendFile(appPath, ms.readAll())

  if (process.platform !== 'win32') {
    fs.chmod(appPath, 511)
  }
}

module.exports.zipEnvInfo = function zipEnvInfo () {
  var srcName = '.env.rc'
  var jscName = srcName + '.jsc'
  var envSrcPath = path.join(__dirname, `../src/conf/${srcName}`)
  var envInfoExePath = path.join(__dirname, `../src/conf/${jscName}`)

  if (!fs.existsSync(envSrcPath)) {
    console.error(`[fibjs:build:error]no .env.rc file in path: ${envSrcPath}!`)
    return
  }

  var envSrcFile = fs.openFile(envSrcPath, 'r')
  var envCfg = envSrcFile.readSync()
  var envJsonStr = ''
  try {
    envJsonStr = JSON.stringify(envCfg.toString(), null, '')
  } catch (error) {
    console.error(`[fibjs:build:error]invalid .env.rc file!`, error)
  }
  if (!envJsonStr) return

  var envScript = `\
var envJSON = JSON.parse(${envJsonStr});\n\
module.exports = envJSON;\n\
`
  // console.log('[fibjs:build]envCfg', envScript)
  try {
    fs.unlink(envInfoExePath)
  } catch (e) {}

  fs.writeFile(envInfoExePath, util.compile('index.js', envScript, 0))

  if (process.platform !== 'win32') {
    fs.chmod(envInfoExePath, 511)
  }

  // test result
  const cfg = require(`../src/conf/${jscName}`)
  console.info('built cfg jsc', cfg)
}
