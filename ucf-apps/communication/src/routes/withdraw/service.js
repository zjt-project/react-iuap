/**
 * 服务请求类  定义请求后台接口地址url ${GROBAL_HTTP_CTX}为全局配置在config中 + 后台controller路径
 */
import {requestBusiness} from "utils/business";
//定义接口地址
const URL = {
    "LIST":  `${GROBAL_HTTP_CTX}/communication/cbWithdraw/list`,
    "SUB_LIST": `${GROBAL_HTTP_CTX}/communication/cbWithdraw/subList`

};

/**
 * 获取主列表
 * @param {*} params
 */
export const getList = (params) => {
    /**
     * 不对接后台时直接使用mock.js中的假数据 并将结果集封装成为请求返回的形式 data+status的形式
     */
    return requestBusiness(params, URL.LIST);
};

/**
 * 获取子表
 * @param params
 * @returns {*}
 */
export const getSubList = (params) => {
    return requestBusiness(params, URL.SUB_LIST)
};

