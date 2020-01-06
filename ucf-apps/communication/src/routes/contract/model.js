import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";
// 接口返回数据公共处理方法，根据具体需要

/**
 * processData : 调用service.js中的请求数据的承接
 * deepClone : 克隆当前指定对象的数据 通常用于数据更新
 */
import {processData,deepClone} from "utils";
import {consoleData} from "utils/service";


export default {
    // 当前节点所通用model名称 使用actions修改状态时必须与此名称一致才可修改
    name: "communicationContract",
    /**
     * 整个model.js分为三个作用域
     * initialState ： 整个props内使用的数据集 对应该节点域范围使用this.props访问的数据 通常用来设置全局使用的初始化参数、
     * reducers ：目前仅设定updateState一个函数 通过this.name.updateState调用 以json格式更新当前域范围内部的数据 与指定界面内部的this.setState功能一致
     * effects ：实现与后台进行异步交互的函数 用于与对接后台业务接口进行业务逻辑交互并返回需要的数据
     */
    initialState: {
        showLoading: false,  //主表加载Loading图标
        queryParam: {        //初始化分页查询的参数
            pageIndex: 0,
            pageSize: 25,
            dataNum:1,       //每页显示条数索引
        },
        queryObj: {},        //查询结果参数 用以完成列表内部的分页 参见loadList中使用的形式
        //页面数据集
        list: [],
        list2: [],
        //主表form表单绑定数据
        formObject:{},
        //当前页选中的数据
        selectedList:[],
        //按钮权限集
        powerButton:[],
        //是否过滤按钮权限
        ifPowerBtn:true,
        //显示字段
        gridColumn:[],
        //是否自定义显示字段
        ifGridColumn:true,
        //是否可编辑
        isEdit:false,
        //是否显示新增页面
        showModal:false,
        //子表新增修改Modal页
        showLoanModal:false,
        //标记区别子表添加/修改的标志
        ifplanAdd:false,
        //子表选中list
        selectedPlanList:[],
        //子表选中form
        planformObj:{},
        //是否列表界面
        isGrid:true,
        //是否加载 详情修改页
        showForm:false,
        exportData:[], //导出数据数组
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
            actions.communicationContract.updateState({showLoading: true});
            let data = processData(await api.getList(param));  // 调用 getList 请求数据
            //处理data返回数据 避免出现数据异常错误
            let updateData = consoleData(data, param, "main", null);
            actions.communicationContract.updateState(updateData); // 更新数据和查询条件
        },

        /**
         * 加载子列表数据
         * @param {*} param
         * @param {*} getState
         */
        async loadChildList(param = {}, getState) {
            // 正在加载数据，显示加载 Loading 图标
            actions.communicationContract.updateState({showLoading: true});
            let data = processData(await api.getList(param));  // 调用 getList 请求数据
            let updateData = {showLoading: false};
            let queryObj = {
                pageIndex:param.pageIndex,
                pageSize:param.pageSize,
                totalPages:Math.ceil(data.data.total/param.pageSize)
            };
            updateData.queryObj = queryObj;
            updateData.queryParam = param;
            updateData.list2 = data;
            actions.communicationContract.updateState(updateData); // 更新数据和查询条件
        },


        /**
         * 更新界面单行数据,使用之前请对需要更新的对象进行深拷贝再传入!!
         * @param {需要更新的记录} record
         * @param {顺序号} index
         * @param {*} getState
         */
        async updateRowData(param={},getState){
            let{index,record} = param;
            let list = getState().communicationContract.list;
            let _list = deepClone(list);
            if(index != undefined){
                _list[index] = record;
            } else if(record._index != undefined){
                _list[record._index] = record;
            } else {
                for(let key of list){
                    // if(key['pk'] == record['pk']){
                    //     key = record;
                    //     break;
                    // }

                    if(key['_index'] == record._index){
                        _list[key] = record;
                        break;
                    }
                }
            }
            actions.communicationContract.updateState({list:_list});
        },
    }
};
