import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { deepClone, getHeight } from "utils";
import { genGridColumn, multiRecordOper } from "utils/service";
import GridMain from 'components/GridMain';
import { Tabs , Button, Icon, ButtonGroup} from 'tinper-bee';

const { TabPane } = Tabs;
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
        this.gridColumnOnTheLoan = [...genGridColumn(this.gridOnTheLoan)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        actions.communicationAccrued.loadList(this.props.queryParam);
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
        actions.communicationAccrued.loadList(queryParam);
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
        actions.communicationAccrued.loadList(queryParam);
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
            this.childList({pk:_selectedList[0].pkAccrued});
        } else {
            actions.communicationAccrued.updateState({ list2: [] });
        }
        this.setState({showFilterPopover:false});
        actions.communicationAccrued.updateState({ list: _list, selectedList: _selectedList, formObject: _formObj, exportData: _selectedList });

    }

    childList = (obj) => {
        //加载子组件列表
        actions.communicationAccrued.loadChildList(obj);
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
        { title: '单据状态', key:'billstatus', type: '6', enumType :'1001650'},
        { title: '计提月份', key: 'accrualMonth', type: '0' },
        { title: '租赁利息计提', key: 'interestAmount', type: '7', digit: 2 },
        { title: '手续费收入计提总额', key: 'feeAmount', type: '7' , digit: 2 },
        { title: '其他收入计提总额', key: 'otherIncomeAmount', type: '7', digit: 2 },
        { title: '其他支出计提总额', key: 'otherExpensesAmount', type: '7' , digit: 2 },
        { title: '操作人', key: 'pkChecker.userName', type: '5' },
        // { title: '操作日期', key: 'operateDate', type: '0' },
        { title: '操作时间', key: 'operateTime', type: '0' },
        // { title: '审核人', key: 'pkChecker.userName', type: '0' },
        // { title: '审核日期', key: 'checkDate', type: '0' },
        // { title: '审核时间', key: 'checkTime', type: '0' },
        { title: '签约主体', key: 'pkGlorgbook.glorgbookname', type: '5' },
        { title: '机构', key: 'pkOrg.orgName', type: '5' }
    ]
    //主表 列属性定义=>通过前端service工具类自动生成
    gridColumn = [];

    // 子表
    gridOnTheLoan = [
        { title: '客户名称', key: 'customerName', type: '0' },
        // { title: '合同名称', key: 'pkContract.contName', type: '0' },
        { title: '合同编号', key: 'pkContract.contCode', type: '5' },
        { title: '起租流程', key: 'leaseFlow', type: '6' , enumType :'1000253'},
        // { title: '资产状态', key: 'assetStatus', type: '0' },
        { title: '资产五级分类', key: 'assetsClassify', type: '6' , enumType :'1000340'},
        // { title: '计税方式', key: 'assetStatus', type: '0' },
        // { title: '部门名称', key: 'aaa', type: '0' },
        { title: '计提月份', key: 'accruedMonth', type: '0' },
        { title: '租赁利息计提金额', key: 'interestAmount', type: '7', digit: 2  },
        { title: '手续费收入计提金额', key: 'feeAmount', type: '7', digit: 2  },
        { title: '其他收入计提金额', key: 'otherIncomeAmount', type: '7', digit: 2  },
        { title: '其他支出计提金额', key: 'otherExpensesAmount', type: '7', digit: 2  },
        { title: '币种', key: 'pkCurrtype.currtypename', type: '5' },
        { title: '汇率', key: 'exchgRate', type: '7', digit: 6  },
        { title: '核算主体', key: 'pkGlorgbook.glorgbookname', type: '0' },
        // { title: '租赁方式', key: 'bbb', type: '0' },
        // { title: '税目类别', key: 'ccc', type: '0' },
        // { title: '资产类型', key: 'ddd', type: '0' }
    ]
    // 子表 列属性定义=>通过前端service工具类自动生成
    gridColumnOnTheLoan = [];

    subExport = () => {
        this.gridsub.exportExcel();
    };

    setExportList = (key) =>{
        if(key == '1'){   //key为1 默认为导出选中数据 先进行校验
            multiRecordOper(this.props.selectedList,(param) => {  //选中数据校验  未选中无法导出
                this.gridref.exportExcel();
            });
        }else if(key == '2'){  //key为2 默认为导出当前页数据
            this.gridref.exportExcel();
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

    //子页签更改活动key方法
    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    }


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
                        tableHeight={1} //表格高度 1主表 2单表 3子表
                        exportFileName="C端计提信息"　    //导出表格名称
                        exportData={this.props.exportData}      //导出表格数据
                        afterFilter={this.afterFilter}          //过滤列的函数
                        showFilterPopover={this.state.showFilterPopover}  //过滤面板是否显示
                        //分页对象
                        paginationObj={{
                            dataNumSelect:['15','25','50','100'],        //每页显示条数动态修改
                            dataNum:this.props.queryParam.dataNum,            //每页显示条数Index
                            activePage: this.props.queryParam.pageIndex,//活动页
                            total: this.props.list.length,//总条数
                            items: this.props.queryObj.totalPages,//总页数
                            freshData: this.freshData, //活动页改变,跳转指定页数据
                            onDataNumSelect: this.onDataNumSelect, //每页行数改变,跳转首页
                        }}
                        getSelectedDataFunc={this.getSelectedDataFunc}

                    />
                </div>
                <div>
                    {/**
                     子表多页签组件Tabs
                     defaultActiveKeky:默认展示页签key
                     className:定义在index.less中的样式属性名称
                     extraContent:额外属性 通常用来添加表头右侧的按钮即 增删改查的小图标
                     TabPane : 单个子表子组件 嵌套在Tabs中使用 key为唯一主键
                     */}
                    <Tabs
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

                        <TabPane tab='子表信息' key="1">
                            <div>
                                <GridMain
                                    ref={(el) => this.gridsub = el} //存模版
                                    columns={this.gridColumnOnTheLoan} //字段定义
                                    multiSelect={false}  //false 单选，默认多选
                                    tableHeight={3} //表格高度 1主表 2单表 3子表 
                                    exportFileName="C端计提信息详情"　    //导出表格名称
                                    exportData={this.props.list2}      //导出表格数据
                                    data={this.props.list2} //数据数组
                                    //分页对象
                                    paginationObj={{
                                        verticalPosition: 'none'
                                    }}
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>

        );
    }
}

export default ListView;