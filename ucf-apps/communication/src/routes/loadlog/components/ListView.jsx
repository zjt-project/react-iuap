import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { deepClone } from "utils";
import { genGridColumn } from "utils/service";
import GridMain from 'components/GridMain';

import './index.less';

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        this.gridColumn = [...genGridColumn(this.grid)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        actions.communicationLoadlog.loadList(this.props.queryParam);
    }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
    }

    /**
     * 跳转到指定页数据
     * @param {Number} pageIndex 跳转指定页数
     */
    freshData = (pageIndex) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        queryParam.pagination['pageIndex'] = pageIndex;
        actions.communicationLoadlog.loadList(queryParam);
    };

    /**
     * 设置每页显示行数
     * @param {Number} index 跳转指定页数
     * @param {Number} value 设置一页数据条数
     */
    onDataNumSelect = (index, value) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        queryParam.pagination['pageSize'] = value;
        queryParam.pagination['pageIndex'] = 1;
        queryParam['dataNum'] = index;
        if (value && value.toString().toLowerCase() === "all") { // 对分页 pageSize 为 all 进行处理，前后端约定
            pageSize = 1;
        }
        actions.communicationLoadlog.loadList(queryParam);
    };

    //主表  列属性定义
    grid = [
        { title: '导入日期', key: 'loadDate', type: '3' },
        { title: '业务类型', key: 'busiType', type: '0' },
        { title: '文件名称', key: 'fileName', type: '0', width: 280 },
        { title: '成功标志', key: 'flag', type: '6', enumType:'trueOrfalse'},
        { title: '总数据条数', key: 'dataNum', type: '1'},
        { title: '来源系统', key: 'sourceSystemDTO.systemName', type: '0' },
    ];
    //主表 列属性定义=>通过前端service工具类自动生成
    gridColumn = [];


    render() {
        return (
            <div className="grid-parent">
                    <GridMain
                        ref="mainlist" //存模版
                        columns={this.gridColumn} //字段定义
                        data={this.props.list} //数据数组
                        tableHeight={2}
                        //分页对象
                        paginationObj={{
                            dataNumSelect:['10','25','50','100'],        //每页显示条数动态修改
                            dataNum:this.props.queryParam.dataNum,            //每页显示条数Index
                            activePage: this.props.queryParam.pagination.pageIndex,//活动页
                            total: this.props.list.length,//总条数
                            items: this.props.queryObj.totalPages,//总页数
                            freshData: this.freshData, //活动页改变,跳转指定页数据
                            onDataNumSelect: this.onDataNumSelect, //每页行数改变,跳转首页
                        }}
                        getSelectedDataFunc={this.getSelectedDataFunc}
                    />
            </div>

        );
    }
}

export default ListView;
