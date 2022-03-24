/*
* 用户管理模块
* */
const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require('../utils/util')

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
        })
        // console.log(res);
        if (res) {
            ctx.body = util.success(res)
        } else {
            ctx.body = util.fail('账号或者密码不正确')
        }
    } catch (e) {
        // 请求失败的时候会走这个步骤
        ctx.body = util.fail(e.msg)
    }
})


module.exports = router
