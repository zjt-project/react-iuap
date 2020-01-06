import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { Tabs } from 'tinper-bee';
import { deepClone } from "utils";
import { genGridColumn, multiRecordOper } from "utils/service";
import GridMain from 'components/GridMain';

import './index.less';

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listView: '',
            gridColumn: [],
        }
    }


    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //主表过滤显示字段
        // const gridMain = this.getShowColumn(this.props.gridColumn, this.grid, true);
        const gridColumn = [...genGridColumn(this.grid)];
        this.setState({gridColumn:gridColumn});
        //this.gridColumnOnTheLoan = [...genGridColumn(this.gridOnTheLoan)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        actions.communicationContract.loadList(this.props.queryParam);
        this.props.onListRef(this);
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
        queryParam['pageIndex'] = pageIndex;
        actions.communicationContract.loadList(queryParam);
    }

    /**
     * 设置每页显示行数
     * @param {Number} index 跳转指定页数
     * @param {Number} value 设置一页数据条数
     */
    onDataNumSelect = (index, value) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        queryParam['pageSize'] = value;
        queryParam['pageIndex'] = 0;
        queryParam['dataNum'] = index;
        if (value && value.toString().toLowerCase() === "all") { // 对分页 pageSize 为 all 进行处理，前后端约定
            pageSize = 1;
        }
        actions.communicationContract.loadList(queryParam);
    }


    setExportList = (key) =>{
        if(key == '1'){   //key为1 默认为导出选中数据 先进行校验
            multiRecordOper(this.props.selectedList,(param) => {  //选中数据校验  未选中无法导出
                this.gridref.exportExcel(key);
            });
        }else if(key == '2'){  //key为2 默认为导出当前页数据
            this.gridref.exportExcel(key);
        }
    }

    afterFilter = (optData,columns)=>{
        const column = deepClone(this.state.gridColumn);
        column.map((item)=>{
            if(item.key == optData.key){
                item.exportHidden = true;
            }
        });
        this.setState({gridColumn:column,showFilterPopover:true});
      }

    // }

    /**
     * 点击row选择框触发绑定数据对象
     * 绑定选中数据数组到数据模型中
     */
    getSelectedDataFunc = (selectedList, record, index) => {
        let { list } = this.props;
        let _list = deepClone(list);
        let _selectedList = deepClone(selectedList);
        let _formObj = {};
        if (index != undefined) {
            _list[index]['_checked'] = !_list[index]['_checked'];
        } else {
            if (_selectedList && _selectedList.length > 0) {
                _list.map(item => {
                    if (!item['_disabled']) {
                        item['_checked'] = true;
                    }
                });
            } else {
                _list.map(item => {
                    if (!item['_disabled']) {
                        item['_checked'] = false;
                    }
                });
            }
        }
        if (_selectedList && _selectedList.length == 1) {
            _formObj = deepClone(_selectedList[0]);
            // this.childList(_formObj);
        } else {
            actions.communicationContract.updateState({ list2: [] });
        }
        this.setState({showFilterPopover:false});
        actions.communicationContract.updateState({ list: _list, selectedList: _selectedList, formObject: _formObj, exportData:_selectedList });

    }

    childList = (obj) => {
        //加载子组件列表
        actions.communicationContract.loadChildList(this.props.queryParam);
    }

    /**
     * 过滤需要处理的字段
     * @param gridColumn 需要处理的字段
     * @param grid 全部的字段
     * @param show show==true gridColumn为需要显示的字段  show==false  gridColumn为隐藏的字段
     */
    getShowColumn = (gridColumn, grid, show) => {
        if (show) {
            grid.map((item, index) => {
                grid[index] = Object.assign(item, { ifshow: false });
            })
        }
        gridColumn.map((item, index) => {
            grid.map((itemGrid, indexGrid) => {
                if (item == itemGrid.key) {
                    const obj = Object.assign(itemGrid, { ifshow: show ? true : false })
                    grid[indexGrid] = obj;
                }
            })
        });
        return grid;
    }

    //gridColumn 需要显示的字段  grid全部的字段
    getColumnByShow = (gridColumn, grid) => {

    }

    //主表  列属性定义 ifshow:false 不显示该列  默认全显示 true
    grid = [
        { title: '合同状态', key: 'contStatus', type: '6', enumType: '1000212'},
        { title: '业务名称', key: 'businessName', type: '6' , enumType: '1001647'},
        { title: '集团名称', key: 'groupName', type: '0' },
        { title: '合同编号', key: 'contCode', type: '0' },
        { title: '合同名称', key: 'contName', type: '0' },
        { title: '客户编号', key: 'customerCode', type: '0' },
        { title: '客户名称', key: 'customerName', type: '0' },
        { title: '客户身份证号', key: 'identityNo', type: '0' },
        { title: '起租流程', key: 'leaseFlow', type: '6', enumType: '1000253' },
        { title: '合同签订日', key: 'contSignedDate', type: '0' },
        { title: '合同投放日', key: 'contLoan', type: '0' },
        { title: '合同实际起租日', key: 'leaseDateFact', type: '0' },
        { title: '合同结束日期', key: 'contEndDate', type: '0' },
        { title: '还款频率', key: 'refundFrequency', type: '6', enumType: '1000008' },
        { title: '还款结构', key: 'refundStructure', type: '6', enumType: '1001600' },
        { title: '租金总计', key: 'leaseCashSum', type: '7', digit: 2  },
        { title: '本金金额', key: 'corpusAmount', type: '7', digit: 2  },
        { title: '利息金额', key: 'interestAmount',type: '7', digit: 2  },
        { title: '租赁方式', key: 'leaseType', type: '6', enumType: '1001013' },
        { title: 'IRR', key: 'marketIrr', type: '7', digit: 6  },
        //{ title: '会计IRR', key: 'financeIrr', type: '7', digit: 6 },
        { title: '客户所属地区(省)', key: 'customerProvince.areaclname', type: '5' },
        { title: '客户所属地区(市)', key: 'customerCity.areaclname', type: '5' },
        { title: '客户所属地区(区)', key: 'customerRegion.areaclname', type: '5' },
        { title: '收票类型', key: 'ticketType', type: '6', enumType: '1001648' },
        { title: '供应商名称', key: 'supplierName', type: '0' },
        { title: '供应商银行账号', key: 'supplierBankAccount', type: '0' },
        { title: '出租人名称', key: 'lessorName', type: '0' },
        { title: '租金回收方式', key: 'leaseRecycling', type: '6', enumType: '1001641' },
        { title: '收款银行账号', key: 'gatherBankAccount', type: '0' },
        { title: '收款银行开户行', key: 'gatherOpenBank', type: '0' },
        { title: '是否有平台方保证金增信', key: 'ifDepositCredit', type: '6', enumType: '1000003' },
        { title: '合作平台方', key: 'cooperationPlatform', type: '0' },
        { title: '保证金额度/保证金比例', key: 'depositRatio', type: '7', digit: 2 },
        { title: '运营商套餐金额', key: 'operatorAmount', type: '7', digit: 2 },
        { title: '运营商套餐期限', key: 'operatorDeadline', type: '0' },
        { title: '终端名称', key: 'terminalName', type: '0' },
        { title: '终端型号', key: 'terminalType', type: '0' },
        { title: '资产五级分类', key: 'assetsClassify', type: '6', enumType: '1000340' },
        { title: '来源系统', key: 'pkSystem.systemName', type: '5' },
    ]
    //主表 列属性定义=>通过前端service工具类自动生成
    gridColumn = [];


    render() {
        return (
            <div className="grid-parent" style={{ display: this.state.listView }}>
                <div>
                    {/**
                     标准表格组件定义GridMain
                     ref:当前表格引用名称 {}直接添加"name" 使用this.name 获取表格内部数据
                     columns:列标题
                     data:数据数组
                     rowKey:生成元数据行的唯一性key
                     tableHeight:表格高度 为1时代表主表高度 不写或不为1时代表子表高度
                     exportFileName:导出表格的名称
                     exportData:导出表格内部的数据
                     paginationObj:分页对象 其中activePage:当前展示页 total:总数据条数  items:总页数
                     freshData:选择跳转指定页函数 onDataNumSelect:选中每页展示多少条数据
                     columnFilterAble:隐藏列表头标题内部的列过滤面板
                     getSelectedDataFunc:选中数据触发事件
                     */}
                    <GridMain
                        ref={(el) => this.gridref = el} //存模版
                        columns={this.state.gridColumn} //字段定义
                        data={this.props.list} //数据数组                     
                        tableHeight={2} //表格高度 1主表 2单表 3子表
                        exportFileName="C端合同信息"　    //导出表格名称
                        exportData={this.props.exportData}      //导出表格数据
                        afterFilter={this.afterFilter}          //过滤列的函数
                        showFilterPopover={this.state.showFilterPopover}  //过滤面板是否显示
                        //分页对象
                        paginationObj={{
                            dataNumSelect:['10','25','50','100'],        //每页显示条数动态修改
                            dataNum:this.props.queryParam.dataNum,            //每页显示条数Index
                            activePage: this.props.queryParam.pageIndex,//活动页
                            total: this.props.queryObj.total,//总条数
                            items: this.props.queryObj.totalPages,//总页数
                            freshData: this.freshData, //活动页改变,跳转指定页数据
                            onDataNumSelect: this.onDataNumSelect, //每页行数改变,跳转首页
                        }}
                        getSelectedDataFunc={this.getSelectedDataFunc}

                    />
                </div>
            </div>

        );
    }
}

export default ListView;