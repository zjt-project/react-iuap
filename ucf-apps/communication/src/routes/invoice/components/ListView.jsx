import React, {Component} from 'react';
import {actions} from 'mirrorx';
import {Tabs, ButtonGroup, Button, Icon} from 'tinper-bee';
import {deepClone, getHeight} from "utils";
import {genGridColumn,multiRecordOper} from "utils/service";

import './index.less';
import GridMain from 'components/GridMain';

const { TabPane } = Tabs;

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listView: '',
            tableHeight: 0,
            gridColumn:[],
        }
    }


    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //主表过滤显示字段
        // const gridMain = this.getShowColumn(this.props.gridColumn, this.grid, true);
        this.resetTableHeight(true);
        const gridColumn = [...genGridColumn(this.gridOnTheLoan)];
        this.setState({gridColumn:gridColumn});
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        actions.communicationInvoice.loadList(this.props.queryParam);
        this.props.onListRef(this);
    }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
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

    /**
     * 跳转到指定页数据
     * @param {Number} pageIndex 跳转指定页数
     */
    freshData = (pageIndex) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        queryParam['pageIndex'] = pageIndex;
        actions.communicationInvoice.loadList(queryParam);
    };

    /**
     * 重置表格高度计算回调
     *
     * @param {Boolean} isopen 是否展开
     */
    resetTableHeight = (isopen) => {
        let tableHeight = 0;
        tableHeight = getHeight() - 155;
        this.setState({ tableHeight });

    };

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
        actions.communicationInvoice.loadList(queryParam);
    };


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
            // _formObj = deepClone(_selectedList[0]);
            // this.childList(_formObj);
        } else {
            actions.communicationInvoice.updateState({ list2: [] });
        }
        this.setState({showFilterPopover:false});
        actions.communicationInvoice.updateState({ list: _list, selectedList: _selectedList, formObject: _formObj, exportData:_selectedList  });

    };

    childList = (obj) => {
        //加载子组件列表
        actions.communicationInvoice.loadChildList({pkInvoiceApply: obj.pkInvoiceApply});
    };

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
    };

    //gridColumn 需要显示的字段  grid全部的字段
    getColumnByShow = (gridColumn, grid) => {

    };

    //主表  列属性定义 ifshow:false 不显示该列  默认全显示 true
    // grid = [
    //     { title: '单据状态', key: 'billstatus', type: '0' },
    //     { title: '开票批次号', key: 'invoiceBatchNo', type: '0' },
    //     { title: '发票总额', key: 'invoiceAmount', type: '7', digit: 2 },
    //     { title: '发票税额', key: 'leaseCashTax', type: '7', digit: 2 },
    //     { title: '不含税金额', key: 'excludingTax', type: '7', digit: 2 },
    //     //{ title: '开票状态', key: 'billingStatus', type: '6', enumType:'1000334' },
    //     { title: '开票日期', key: 'billingData', type: '0' },
    //     { title: '发票代码', key: 'invoiceCode', type: '0' },
    //     { title: '来源系统', key: 'pkSys.systemName', type: '0' },
    // ];
    // //主表 列属性定义=>通过前端service工具类自动生成
    // gridColumn = [];

    // 主表
    gridOnTheLoan = [
        { title: '合同编号', key: 'contCode', type: '0' },
        { title: '合同名称', key: 'contName', type: '0' },
        { title: '发票抬头', key: 'invoiceTitle', type: '0' },
        { title: '起租流程', key: 'leaseFlow', type: '6', enumType:'1000253' },
        { title: '税号', key: 'ein', type: '0' },
        { title: '单位地址', key: 'employerAddress', type: '0' },
        { title: '电话号码', key: 'telephoneNumber', type: '0' },
        { title: '开户银行', key: 'openingBank', type: '0' },
        { title: '银行账号', key: 'bankAccount', type: '0' },
        { title: '邮寄地址', key: 'mailingAddress', type: '0' },
        { title: '客户编码', key: 'customerCode', type: '0' },
        { title: '客户名称', key: 'customerName', type: '0' },
        { title: '单位名称', key: 'employerName', type: '0' },
        //{ title: '电话号码', key: 'telephoneNumber', type: '0' },
        { title: '租赁方式', key: 'leaseType', type: '6', enumType:'1001013' },
        { title: '期次', key: 'leaseTime', type: '0' },
        { title: '应收日期', key: 'planDate', type: '0' },
        { title: '开票金额', key: 'invoiceAmount', type: '7', digit: 2 },
        { title: '税率', key: 'taxRate', type: '7', digit: 6 },
        { title: '税额', key: 'leaseCashTax', type: '7', digit: 2 },
        { title: '不含税金额', key: 'excludingTax', type: '7', digit: 2 },
        { title: '开票状态', key: 'billingStatus', type: '6', enumType:'1000334' },
        { title: '开票内容', key: 'invoiceContents', type: '6', enumType:'1000125' },
        { title: '开票日期', key: 'billingData', type: '0'},
        { title: '核销状态', key: 'verificationStatus', type: '6', enumType:'1000316' },
        { title: '发票代码', key: 'companyMainBody', type: '0' },
        { title: '发票号码', key: 'companyMainBody', type: '0' },
        { title: '公司主体', key: 'companyMainBody', type: '0' },
        { title: '来源系统', key: 'pkSys.systemName', type: '5' },
    ];
    // 投放计划 列属性定义=>通过前端service工具类自动生成
    gridColumnOnTheLoan = [];


    subExport = () => {
        this.refs.sublist.exportExcel();
    };

    //子页签更改活动key方法
    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };


    render() {
        let {tableHeight} = this.state;

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
                        exportFileName="C端票据信息"　    //导出表格名称
                        exportData={this.props.exportData}      //导出表格数据
                        afterFilter={this.afterFilter}          //过滤列的函数
                        showFilterPopover={this.state.showFilterPopover}  //过滤面板是否显示
                        //分页对象
                        paginationObj={{
                            dataNumSelect:['10','25','50','100'],        //每页显示条数动态修改
                            dataNum:this.props.queryParam.dataNum,            //每页显示条数Index
                            activePage: this.props.queryParam.pageIndex,//活动页
                            total: this.props.list.length,//总条数
                            items: this.props.queryObj.totalPages,//总页数
                            freshData: this.freshData, //活动页改变,跳转指定页数据
                            onDataNumSelect: this.onDataNumSelect, //每页行数改变,跳转首页
                        }}
                        // onRowClick={this.onRowSelect}
                        getSelectedDataFunc={this.getSelectedDataFunc}

                    />
                </div>
                {/* <div> */}
                    {/**
                     子表多页签组件Tabs
                     defaultActiveKeky:默认展示页签key
                     className:定义在index.less中的样式属性名称
                     extraContent:额外属性 通常用来添加表头右侧的按钮即 增删改查的小图标
                     TabPane : 单个子表子组件 嵌套在Tabs中使用 key为唯一主键
                     */}
                    {/* <Tabs
                        defaultActiveKey="1"
                        onChange={this.onChange}
                        className="list-tabs"
                        extraContent={
                            <div className = "public_sub_but">
                                <ButtonGroup style={{ margin: 1 }}>
                                    <Button shape='border' onClick={this.subExport}><Icon type='uf-export' /></Button>
                                </ButtonGroup>
                            </div>
                        }
                    >

                        <TabPane tab="开票明细" key="1">
                            <div>
                                <GridMain
                                    ref="sublist" //存模版
                                    exportref = {"sublist"}
                                    columns={this.gridColumnOnTheLoan} //字段定义
                                    multiSelect={false}  //false 单选，默认多选
                                    data={this.props.list2} //数据数组
                                    exportFileName="C端票据信息"　    //导出表格名称
                                    exportData={this.props.list2} 
                                    //分页对象
                                    paginationObj={{
                                        verticalPosition: 'none'
                                    }}
                                />
                            </div>
                        </TabPane>
                    </Tabs> */}
                {/* </div> */}
            </div>

        );
    }
}

export default ListView;
