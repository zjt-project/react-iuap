/**
 * 服务请求类  定义请求后台接口地址url ${GROBAL_HTTP_CTX}为全局配置在config中 + 后台controller路径
 */
import {requestBusiness} from "utils/business";
//定义接口地址
const URL = {
    "LIST":  `${GROBAL_HTTP_CTX}/communication/cbInvoiceApply/queryForGrid`,
    "SUB_LIST": `${GROBAL_HTTP_CTX}/communication/cbInvoiceApply/subList`,
    "SUB_NOT_INVOICE_LIST": `${GROBAL_HTTP_CTX}/communication/cbInvoiceApply/subNotInvoice`,
    "SAVE": `${GROBAL_HTTP_CTX}/communication/cbInvoiceApply/save`

}

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
export const getSubList = (params) => {
    return requestBusiness(params,URL.SUB_LIST);
};

export const getSubNotInvoice = (params) => {
    return requestBusiness(params,URL.SUB_NOT_INVOICE_LIST);
};
export const save = (selected) => {
    return requestBusiness(selected, URL.SAVE);
};

