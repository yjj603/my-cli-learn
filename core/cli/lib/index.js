'use strict';
module.exports = core;
const path = require('path')
//跨os拿到主目录
const userHome = require('user-home')
//判断路径是否存在
const pathExists = require('path-exists').sync
//比较版本号
const semver = require('semver')
const colors = require('colors/safe')
//root权限降级
// const rootCheck = require('root-check')
//日志封装
const log = require('@my-cli-learn/log')
const constant = require('./const')
const pkg = require('../package.json')
let args,config
function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkUserHome()
        checkInputArgs()
        checkEnv()
        checkGlobalUpdate()
    }catch (e) {
        log.error(e.message)
    }

}

function checkGlobalUpdate(){
    const currentVersion = pkg.version
    const npmName = pkg.name
    const {getNpmInfo} = require('@my-cli-learn/get-npm-info')
    getNpmInfo(npmName)
}

function checkEnv(){
    const dotenv = require('dotenv')
    const dotenvPath = path.resolve(userHome,'.env')
    if(pathExists(dotenvPath)){
        dotenv.config({
            path:dotenvPath
        })
    }
    createDefaultConfig()
    log.verbose('环境变量',process.env.CLI_HOME_PATH)
}

function createDefaultConfig(){
    const cliConfig= {
        home:userHome
    }
    if(process.env.CLI_HOME){
        cliConfig.cliHome = path.join(userHome,process.env.CLI_HOME)
    }else{
        cliConfig.cliHome = path.join(userHome,constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkInputArgs(){
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    console.log(args)
    checkArgs()
}

function checkArgs(){
    if(args.debug){
        process.env.LOG_LEVEL = 'verbase'
    }else{
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}

function checkUserHome(){
    if(!userHome || !pathExists(userHome)){
        throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}

function checkRoot(){
    /*rootCheck()
    console.log(process.geteuid())*/
}

function checkNodeVersion(){
    const currentVersion = process.version
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if(!semver.gte(currentVersion,lowestVersion)){
        throw new Error(colors.red(`my-cli-learn需要安装v${lowestVersion}以上版本的Node.js`))
    }
}

function checkPkgVersion(){
    log.notice('cli',pkg.version)
}
