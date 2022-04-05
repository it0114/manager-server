const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
const log4js = require("./utils/log4j")
const cors = require('koa2-cors')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const util = require("./utils/util")

/*
* jsonwebtoken 使用
* 1. 需要在注册或者登陆账号的时候给 sign 进行签名
* 2. 需要在需要验证的时候 使用 jwt.verify 进行验证token
* */


// 路由
const users = require('./routes/users')

// 配置文件
const config = require('./config/index.js')


// 允许跨域
app.use(
    cors({
        origin: function (ctx) { //设置允许来自指定域名请求
            if (ctx.url === '/test') {
                return '*'; // 允许来自所有域名请求
            }
            return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法'
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    })
);

// error handler
onerror(app)

// 数据库
require("./config/db")

// middlewares 中间件
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())

// 用于返回静态文件
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
    log4js.info(`get params : ${JSON.stringify(ctx.request.query)}`)
    log4js.info(`post params : ${JSON.stringify(ctx.request.body)}`)
    await next().catch(err => {
        if (err.status.toString() === '401') {
            ctx.status = 200   // token 验证失败的时候, 不更改状态码, 而改为更改业务码
            ctx.body = util.fail('Token 认证失败', util.CODE.AUTH_ERROR)
        } else {
            // 如果不是 401 在继续抛出错误
            throw err
        }
    })
})

// 使用中间件 koa-jwt 进行token验证
app.use(koajwt({secret: config.SecretKey}).unless({
    // path: [/^\/api\/users\/login/] // 过滤不需要验证的路由
    path: ['/api/users/login'] // 过滤不需要验证的路由
}))

// routes
// 1. 一级路由根地址
router.prefix('/api')

// 2. 注册二级路由
router.use(users.routes(), users.allowedMethods())

// router.get('/leave/count', ctx => {
//     // console.log(ctx);
//     const token = ctx.request.header.authorization.split(' ')[1]
//     // console.log(token);
//     let payload = jwt.verify(token, config.SecretKey)   // 第二个参数是秘钥, 需要和你加密的时候的秘钥一致
//     console.log(payload);
//     ctx.body = {
//         code: 200,
//         data: {
//             count: 10
//         }
//     }
// })
router.get('/menu/list', ctx => {
    ctx.body = {
        code: 200,
    }
})

// 3. 把路由挂载到 app 上
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    // console.error('server error', err, ctx)
    log4js.error(`${err.stack}`)
});


module.exports = app
