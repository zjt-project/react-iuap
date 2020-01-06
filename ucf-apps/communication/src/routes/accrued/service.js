/**
 * 服务请求类  定义请求后台接口地址url ${GROBAL_HTTP_CTX}为全局配置在config中 + 后台controller路径
 */
import request from "axios";
import {requestBusiness} from "utils/business";
import * as mock from "./mock";
//定义接口地址
const URL = {
    "GET_LIST":  `${GROBAL_HTTP_CTX}/sales/list`,
    "LIST":  `${GROBAL_HTTP_CTX}/communication/accrued/queryForGrid`,
    "ON_ADD": `${GROBAL_HTTP_CTX}/communication/accrued/onAdd`,
    "ON_SAVE": `${GROBAL_HTTP_CTX}/communication/accrued/save`,
    "FIND_ONE": `${GROBAL_HTTP_CTX}/communication/accrued/findOne`,
}

/**
 * 获取主列表
 * @param {*} params
 */
export const getList = (params) => {
    return requestBusiness(params, URL.LIST);
}

/**
 * 获取子表数据
 * @param {*} params
 */
export const findOne = (params) => {
    return requestBusiness(params, URL.FIND_ONE);
}

/**
 * 获取主列表
 * @param {*} params
 */
export const onAdd = (params) => {
    return requestBusiness(params, URL.ON_ADD);
}

/**
 * 保存
 * @param {*} params
 */
export const onSave = (params) => {
    return requestBusiness(params, URL.ON_SAVE);
}

