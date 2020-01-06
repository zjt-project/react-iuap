import request from "axios";
import Item from "antd/lib/list/Item";
import { deepClone,Info } from "utils";
//定义接口地址
const URL = {
    "ENUM_CONSTANT": `${GROBAL_HTTP_CTX}/sales/list`
};

let enumArray;
export function enumConstant(type) {
    if(enumArray == undefined){
        enumArray = localStorage.getItem("paramType");
    }
    let array;
    let request=[];
    if(enumArray){
        array = deepClone(JSON.parse(enumArray));
        array.map((item) =>{
            if(item[type]){
                request = item[type];
            }
        })
    }
    return request;
}

export function enumConstantValue(type, value) {
    let array = enumConstant(type);
    let request = '未定义';
    array.map((item) =>{
        if(item.value == value){
            request = item.key;
        }
    })
    return request;
}
