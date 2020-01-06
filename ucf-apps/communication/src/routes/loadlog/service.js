import {requestBusiness} from "utils/business";
//定义接口地址
const URL = {
    "LIST":  `${GROBAL_HTTP_CTX}/communication/cbLoadlog/queryForGrid`,
};

/**
 * 获取主列表
 * @param {*} params
 */
export const getList = (params) => {
    return requestBusiness(params, URL.LIST);
};


