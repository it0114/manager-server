/*
* 数据库
* source .bash_profile
* mac启动命令 : mongod --config /usr/local/mongodb/mongo/conf/mongo.conf
* */
const mongoose = require('mongoose')
const config = require("./index")
const log4js = require("../utils/log4j")

// 连接数据库
mongoose.connect(config.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
    log4js.error('***数据库连接失败***')
})

db.on('open', () => {
    log4js.info('***数据库连接成功***')
})

