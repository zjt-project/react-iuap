import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";
// 接口返回数据公共处理方法，根据具体需要

/**
 * processData : 调用service.js中的请求数据的承接
 * deepClone : 克隆当前指定对象的数据 通常用于数据更新
 */
import {processData,deepClone} from "utils";
import {consoleDataByPagi} from "utils/service";


export default {
    // 当前节点所通用model名称 使用actions修改状态时必须与此名称一致才可修改
    name: "communicationLoadlog",
    /**
     * 整个model.js分为三个作用域
     * initialState ： 整个props内使用的数据集 对应该节点域范围使用this.props访问的数据 通常用来设置全局使用的初始化参数、
     * reducers ：目前仅设定updateState一个函数 通过this.name.updateState调用 以json格式更新当前域范围内部的数据 与指定界面内部的this.setState功能一致
     * effects ：实现与后台进行异步交互的函数 用于与对接后台业务接口进行业务逻辑交互并返回需要的数据
     */
    initialState: {
        showLoading: false,  //主表加载Loading图标
        queryParam: {        //初始化分页查询的参数
            pagination:{
                pageIndex: 0,
                pageSize: 25,
                dataNum:1,       //每页显示条数索引
            }    
        },
        queryObj: {},        //查询结果参数 用以完成列表内部的分页 参见loadList中使用的形式
        //页面数据集
        list: [],
        //按钮权限集
        powerButton:[],
        //是否过滤按钮权限
        ifPowerBtn:true,
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
         * 加载列表数据
         * @param {*} param
         * @param {*} getState
         */
        async loadList(param = {}, getState) {
            // 正在加载数据，显示加载 Loading 图标
            actions.communicationLoadlog.updateState({showLoading: true});
            let data = processData(await api.getList(param));  // 调用 getList 请求数据
            //处理data返回数据 避免出现数据异常错误
            let updateData = consoleDataByPagi(data, param, "main", null);
            // let data = response.data;
            // let updateData = {showLoading: false};
            // updateData.queryObj = {
            //     pageIndex:param.pagination.pageIndex,
            //     pageSize:param.pagination.pageSize,
            //     totalPages:Math.ceil( data.total / param.pagination.pageSize)
            // };
            // updateData.queryParam = param;
            // updateData.list = data.pageData;
            actions.communicationLoadlog.updateState(updateData); // 更新数据和查询条件
        },
    }
};
