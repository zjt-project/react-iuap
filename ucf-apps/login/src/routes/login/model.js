import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";
// 接口返回数据公共处理方法，根据具体需要
import {processData,deepClone} from "utils";


export default {
    name: "login",
    initialState: {
        username: '',                // 用户名
        password: '',                // 密码
        errMsg: '',                  // 错误信息
        checked: false,              // 是否勾选记住用户名
        lastLoginIsRemember: false,  // 上次是否记住用户,
        currentSystem :'中建投C端通信系统',           // 当前选中的系统pk
        systemList:[],               // 系统列表
    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) { //更新state
            return {
                ...state,
                ...deepClone(data)
            };
        },
    },
    effects: {

         /**
         * 获取系统列表
         */
        async getSystemList() {
            let res = processData(await api.getSystemList());
            res = res.data;
            let systemList = [];
            if (res != undefined && res != null) {   //系统内部列表存在
                systemList = res;
            }
            actions.login.updateState({
                systemList: systemList,
            });
        },
        
        /**
         * 执行登陆逻辑
         */
        async loginAjax(loginData,getState) {
            let checked = getState().login.checked;
            let username = loginData.username;
            let password = loginData.password;
            let res = processData(await api.loginAjax(loginData));
            res = res.data;
            if(res != undefined && res != null){  //证明用户存在 缓存并登陆
                //将当前用户的信息存入缓存 以便处理登陆信息
                localStorage.removeItem("user");
                localStorage.setItem("user",JSON.stringify(res));
                var lastLoginName = localStorage.getItem("lastLoginName");
                if (lastLoginName == undefined || lastLoginName !== username) {
                    localStorage.setItem("lastLoginName", username);
                    localStorage.setItem("lastLoginPassword", password);
                }
                //缓存记住密码勾选状态，选中记住密码则本地缓存密码密文，未选则清除缓存的密码密文
                localStorage.setItem("lastLoginIsRemember", checked);
                if (checked) {
                    localStorage.setItem("lastLoginName", username);
                    localStorage.setItem("lastLoginPassword", password);
                } else {
                    localStorage.removeItem("lastLoginName");
                    localStorage.removeItem("lastLoginPassword");
                }
                //登录成功 缓存枚举项数据
                let paramType = processData(await api.getParamType());
                localStorage.setItem("paramType", JSON.stringify(paramType));
                //成功登陆
                window.localStorage.setItem("canOpen","true");
                window.open(`/${GROBAL_PORTAL_ID}/home`, "_self");
            }else{
                actions.login.updateState({errMsg:'用户名或密码错误'})
            }
        },
    }

};
