/*
* 用户管理模块
* */
const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require('../utils/util')
// token
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 根路径
router.prefix('/users')

// 登陆
router.post("/login", async ctx => {
    try {
        const {userName, userPwd} = ctx.request.body
        // console.log(userName);
        // console.log(userPwd);

        // 通过用户名和密码来进行查询数据
        const res = await User.findOne({
            userName,
            userPwd
        }, 'userId userName userEmail state role deptId roleList') // 指定返回字段
        let data = res._doc
        // console.log(res);
        if (res) {
            // 生成 token , res._doc 作为payload , 过期时间为 1小时
            const token = jwt.sign({
                data
            }, config.SecretKey, { // 第二个参数 是秘钥
                expiresIn: '1h'
            })

            data.token = token
            ctx.body = util.success(data)
        } else {
            ctx.body = util.fail('账号或者密码不正确')
        }
    } catch (e) {
        // 请求失败的时候会走这个步骤 (请求错误, 或者数据库挂了)
        ctx.body = util.fail(e.msg)
    }
})


module.exports = router
