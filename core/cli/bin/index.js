#! /usr/bin/env node

const importLocal = require('import-local')
const log = require('npmlog')
if(importLocal(__filename)){
    log.info('cli','正在使用本地版本2')
}else {
    require('../lib')(process.argv.slice(2))
}
