const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
const log4js = require("./utils/log4j")
// const cors = require('koa2-cors')
const router = require('koa-router')()

// 路由
const users = require('./routes/users')

//
// // 允许跨域
// app.use(
//     cors({
//         origin: function (ctx) { //设置允许来自指定域名请求
//             if (ctx.url === '/test') {
//                 return '*'; // 允许来自所有域名请求
//             }
//             return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
//         },
//         maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//         credentials: true, //是否允许发送Cookie
//         allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法'
//         allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
//         exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
//     })
// );

// error handler
onerror(app)

// 数据库
require("./config/db")

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
    log4js.info(`get params : ${JSON.stringify(ctx.request.query)}`)
    log4js.info(`post params : ${JSON.stringify(ctx.request.body)}`)
    await next()
})

// routes
// 1. 一级路由根地址
router.prefix('/api')
// 2. 注册二级路由
router.use(users.routes(), users.allowedMethods())
// 3. 把路由挂载到 app 上
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    // console.error('server error', err, ctx)
    log4js.error(`${err.stack}`)
});

module.exports = app
