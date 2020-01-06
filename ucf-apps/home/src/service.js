/**
 * 服务请求类
 */
import request from "axios";
import { requestBusiness } from "utils/business";
//定义接口地址
const URL = {
    "GET_LIST":  `${GROBAL_HTTP_CTX}/order/list`,
    "GET_LOCALE": `${GROBAL_HTTP_CTX}/i18n/classification/serial`,
    "GET_LANGLIST": `${GROBAL_HTTP_CTX}/i18n/classification/list`,
    "GET_MENU":  `${GROBAL_HTTP_CTX}/sys/getMenuList`,
    "LOG_OUT" : `${GROBAL_HTTP_CTX}/sys/logout`,
    "GET_MENU_PORTAL":  `${GROBAL_HTTP_CTX}/appmenumgr/listSidebarByApportalCode`,
    "GET_USER_MENU":  `${GROBAL_HTTP_CTX}/moreMenu/list`,
    "GET_UNREADMSG":`/iuap-saas-message-center/message/getUnReadMsg`,
    "GET_WEBPUSHINFO":`${GROBAL_HTTP_CTX}/webpush/getInfo`,
    "wbMenuCollection":`${GROBAL_HTTP_CTX}/wbMenuCollection/create`,
    "wbMenuUncollection":`${GROBAL_HTTP_CTX}/wbMenuCollection/delete`,
    "GET_ALLTENANT":`${GROBAL_HTTP_CTX}/platform/cas/getAllTenant`,
    "GET_SWITCHTENANT":`${GROBAL_HTTP_CTX}/platform/cas/switchTenant`,
    "GET_GETBYID":`${GROBAL_HTTP_CTX}/userMGT/getById`,
}


/**
 * 获取菜单信息
 * @param {*} params
 */
export const getList = (params) => {
    return requestBusiness(params,URL.GET_MENU);
};

/**
 * 注销登陆用户
 * @param {} params 
 */
export const logout = (params) =>{
    return requestBusiness(params,URL.LOG_OUT);
}

/**
 * 获取用户菜单数据
 * @param {*} params
 */
export const loadUserMenuList = (params) => {
    let menu = {status:200,data:
        {
            "status" : "1",
            "message" : null,
            "data" : [ {
              "metaDefinedName" : "User",
              "namespace" : "com.yonyou.iuap.portal.menu.more.vo.MoreMenuVO",
              "status" : 0,
              "changedPropertyNames" : null,
              "ts" : null,
              "dr" : null,
              "system" : null,
              "tenant" : null,
              "pkMoreMenu" : "WB_00000000002",
              "code" : "editpassword",
              "name" : "修改密码",
              "name2" : "Modify the password",
              "name3" : "修改密碼",
              "name4" : null,
              "name5" : null,
              "name6" : null,
              "url" : "/editpassword",
              "urlType" : "view",
              "sort" : 4,
              "icon" : "iconfont icon-passwordicon",
              "isenable" : "Y",
              "tag" : "WB_0000000002"
            }, {
              "metaDefinedName" : "User",
              "namespace" : "com.yonyou.iuap.portal.menu.more.vo.MoreMenuVO",
              "status" : 0,
              "changedPropertyNames" : null,
              "ts" : null,
              "dr" : null,
              "system" : null,
              "tenant" : null,
              "pkMoreMenu" : "WB_00000000003",
              "code" : "personsetting",
              "name" : "个人设置",
              "name2" : "Personal setting",
              "name3" : "個人設置",
              "name4" : null,
              "name5" : null,
              "name6" : null,
              "url" : "/personsetting",
              "urlType" : "view",
              "sort" : 5,
              "icon" : "iconfont icon-setting",
              "isenable" : "Y",
              "tag" : "WB_0000000003"
            } ]

        }
    };
    return menu;
}

/**
 * 获取租户数据
 * @param {*} params
 */
export const getAllTenant = (params) => {
    return request(URL.GET_ALLTENANT + '?r=' + Math.random(), {
        method: "get"
    });
}
/**
 * 设置租户数据
 * @param {*} params
 */
export const setTenant = (params) => {
    return request(URL.GET_SWITCHTENANT + '?r=' + Math.random(), {
        method: "get",
        param:params
    });
}
/**
 * 获取未读消息数
 * @param {*} params
 */
export const loadUnReadMsg = (params) => {
    //NC测试数据
    const result = {"status":200,data:{"status":1,"unReadNum":8}};
    return result;
}
/**
 * 获取消息推送配置
 * @param {*} params
 */
export const getWebPushInfo = (params) => {
    let result = {"status":200,data:{
        "status" : 1,
        "webpush" : {
          "webpuship" : "172.20.52.95",
          "webpushport" : "30005"
        }
      }};
      return result;
}
/**
 * 菜单收藏功能
 * @param {*} params
 */
export const wbMenuCollection = (params) => {
    return request(URL.wbMenuCollection + '?r=' + Math.random(), {
        method: "post",
        data:params
    });
}
/**
 * 取消收藏功能
 * @param {*} params
 */
export const wbMenuUncollection = (params) => {
    return request(URL.wbMenuUncollection + '?r=' + Math.random(), {
        method: "get",
        param:params
    });
}

export const setLocaleParam = (newLocaleValue) => {
    let url = URL.GET_LOCALE + '?locale=' + newLocaleValue + '&r=' + Math.random();
    return request(url, {
        method: "get"
    });
}

export const getLanguageList = () => {
    let url = URL.GET_LANGLIST;
   return {"status":200,data:{
        "status" : 1,
        "data" : [ {
          "id" : "1",
          "prelocale" : "zh_CN",
          "serialid" : 1,
          "pageshow" : "中文简体",
          "description" : null,
          "enabled" : 1,
          "i18nDefault" : 1
        }, {
          "id" : "2",
          "prelocale" : "en_US",
          "serialid" : 2,
          "pageshow" : "English",
          "description" : null,
          "enabled" : 1,
          "i18nDefault" : 0
        }, {
          "id" : "3",
          "prelocale" : "zh_TW",
          "serialid" : 3,
          "pageshow" : "繁體中文",
          "description" : null,
          "enabled" : 1,
          "i18nDefault" : 0
        } ]
      }};
}


/**
 * 获取人员信息
 * @param {*} params
 */
export const getUserById = (id) => {
    let url = URL.GET_GETBYID + '/' + id + '?r='+Math.random();
    return request(url, {
        method: "get"
    });
};
