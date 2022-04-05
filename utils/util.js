/*
* 通用函数封装
* */

const log4j = require("./log4j")

// 返回编码
const CODE = {
    SUCCESS: 200, // 成功
    PARAM_ERROR: 10001, // 参数错误
    USER_ACCOUNT_ERROR: 20001, // 账号或密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, // 业务请求失败
    AUTH_ERROR: 50001  // 认证失败或者TOKEN过期
}

module.exports = {
    /**
     * 分页器
     * @param {number} pageNum
     * @param {number} pageSize
     *
     * */
    pager({pageNum = 1, pageSize = 10}) {
        pageNum = Number(pageNum)
        pageSize = Number(pageSize)
        const skipIndex = (pageNum - 1) * pageSize // mongodb limit 规则
        return {
            page: {
                pageNum,
                pageSize
            },
            skipIndex
        }
    },
    /**
     * 状态码返回
     * */
    success(data = '', msg = '', code = CODE.SUCCESS) {
        log4j.debug(data)
        return {
            code, data, msg
        }
    },
    fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
        log4j.debug(msg)
        return {
            code, data, msg
        }
    },
    CODE
}
