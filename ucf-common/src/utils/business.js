/**
 * 服务请求通用接口
 */
import request from "axios";

export const requestBusiness = (params, url) => {
    let data = localStorage.getItem("user");
    let user = null;
    if(data!=null){
        user = JSON.parse(data);
    }
    return request(url, {
      method : "post",
      data : params,
      headers: {'token': user !=null ? user.tokenid:null} //设置header信息
  }).catch((error)=>{          //后台抛出异常 也要统一返回信息处理
        return error.response;
    })
}
