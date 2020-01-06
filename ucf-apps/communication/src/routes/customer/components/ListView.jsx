import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { Tabs } from 'tinper-bee';
import { deepClone } from "utils";
import { genGridColumn, getShowColumn, multiRecordOper } from "utils/service";
import GridMain from 'components/GridMain';
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
        //const gridMain = getShowColumn(this.props.gridColumn,this.grid,true);
        const gridMain = getShowColumn(this.props.gridColumn,this.grid,true);
        const gridColumn = [...genGridColumn(gridMain)];
        this.setState({gridColumn:gridColumn});
        //this.gridColumnOnSon = [...genGridColumn(this.gridOnSon)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        actions.customer.loadList(this.props.queryParam);
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
        actions.customer.updateState({queryParam:queryParam});
        actions.customer.loadList(queryParam);
    }

    /**
     * 设置每页显示行数
     * @param {Number} index 跳转指定页数
     * @param {Number} value 设置一页数据条数
     */
    onDataNumSelect = (index, value) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        queryParam['pageSize'] = value;
        queryParam['pageIndex'] = 1;
        queryParam['dataNum'] = index;
        if (value && value.toString().toLowerCase() === "all") { // 对分页 pageSize 为 all 进行处理，前后端约定
            pageSize = 1;
        }
        actions.customer.updateState({queryParam:queryParam});
        actions.customer.loadList(queryParam);
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
            actions.customer.updateState({ list2: [] });
        }
        this.setState({showFilterPopover:false});
        actions.customer.updateState({ list: _list, selectedList: _selectedList, formObject: _formObj, exportData:_selectedList });
    }

    // childList = (obj) => {
    //     //加载子组件列表
    //     actions.customer.loadChildList(this.props.queryParam);
    // }

    //主表  列属性定义
    grid = [
        { title: '客户编码', key: 'customerCode', type: '0' },
        { title: '客户名称', key: 'customerName', type: '0' },
        { title: '证件类型', key: 'identityType', type: '6',enumType:'1000150' },
        { title: '证件号码', key: 'identityNo', type: '0' },
        { title: '出生日期', key: 'birthday', type: '0' },
        { title: '签发机关', key: 'issuingAuthority', type: '0' },
        { title: '有效期限', key: 'validTerm', type: '0' },
        { title: '年龄', key: 'age', type: '1' },
        { title: '性别', key: 'sex', type: '6' ,enumType:'1000151'},
        { title: '文化程度', key: 'levelOfEducation', type: '6',enumType:'1000155' },
        { title: '联系方式', key: 'contact', type: '0' },
        { title: '婚姻状况', key: 'marryStatus', type: '6', enumType:'1000154' },
        { title: '子女情况', key: 'childrenStatus', type: '0' },
        { title: '子女上学情况', key: 'childrenSchoolStatus', type: '0' },
        { title: '行业类型', key: 'industryType', type: '6', enumType:'000277' },
        { title: '职称', key: 'officalTitle', type: '6',enumType:'1001644' },
        { title: '职业', key: 'job', type: '6',enumType:'1001640' },
        { title: '户籍地址', key: 'permanentAddress', type: '0' },
        { title: '居住地址', key: 'homeAddr', type: '0' },
        { title: '单位名称', key: 'employerName', type: '0' },
        { title: '单位地址', key: 'employerAddress', type: '0' },
        //{ title: '单位性质', key: 'employerNature', type: '0' },
        { title: '本单位工作年限', key: 'lengthOfService', type: '6',enumType:'1001645'  },
        { title: '本地居住年限(年)', key: 'lengthLocalResidence', type: '6' ,enumType:'1001645'},
        { title: '是否有房产', key: 'realEstate', type: '6',enumType:'1000003' },
        { title: '产权所有人', key: 'titleHolder', type: '0' },
        { title: '房产面积', key: 'theHousingArea', type: '1' , digit : 2},
        { title: '房产所在地', key: 'realEstateHome', type: '0' },
        { title: '详细地址', key: 'detailedAddress', type: '0' },
        { title: '房产性质', key: 'realEstateProperties', type: '0' },
        { title: '房产区域', key: 'realEstateArea', type: '0' },
        { title: '年固定收入(元)', key: 'fixedAnnualIncome', type: '1', digit : 2 },
        { title: '征信时间', key: 'creditTime', type: '4' },
        { title: '征信对象类型', key: 'creditObjType', type: '0' },
        { title: '征信结果', key: 'creditResult', type: '0' },
        { title: '征信原因描述', key: 'creditReasonDescribe', type: '0' },
        { title: '征信评分', key: 'creditRating', type: '0' },
        { title: '征信编号', key: 'creditCode', type: '0' },
        { title: '征信生成时间', key: 'creditGenerateTime', type: '4' },
        { title: '联系人姓名', key: 'linkmanName', type: '0' },
        { title: '联系人联系方式', key: 'linkmanContact', type: '0' },
        { title: '联系人与承租人关系', key: 'linkmanLesseeRelationship', type: '6',enumType:'1001646' },
        { title: '联系人居住地址', key: 'linkmanAddress', type: '0' },
        { title: '配偶姓名', key: 'spouseName', type: '0' },
        { title: '配偶证件类型', key: 'spouseIdentityType', type: '6',enumType:'1000150' },
        { title: '配偶证件号码', key: 'spouseIdentityNo', type: '0' },
        { title: '配偶年龄', key: 'spouseAge', type: '1' },
        { title: '配偶联系方式', key: 'spouseContact', type: '0' },
        { title: '配偶文化程度', key: 'spouseLevelEducation', type: '6',enumType:'1000155' },
        { title: '配偶工作单位名称', key: 'spouseEmployerName', type: '0' },
        { title: '配偶单位电话', key: 'spouseEmployerPhone', type: '0' },
        { title: '配偶单位地址', key: 'spouseEmployerAddress', type: '0' },
        //{ title: '配偶单位性质', key: 'spouseEmployerNature', type: '0' },
        { title: '担保人姓名', key: 'guarantorName', type: '0' },
        { title: '担保人证件类型', key: 'guarantorIdentityType', type: '6',enumType:'1000150'  },
        { title: '担保人证件号', key: 'guarantorIdentityNo', type: '0' },
        { title: '担保人出生日期', key: 'guarantorBirthday', type: '3' },
        { title: '担保人性别', key: 'guarantorSex', type: '6',enumType:'1000154' },
        { title: '担保人年龄', key: 'guarantorAge', type: '1' },
        { title: '担保人联系方式', key: 'guarantorContact', type: '0' },
        { title: '担保人与承租人关系', key: 'guarantorLesseeRelationship', type: '6',enumType:'relationship'  },
        { title: '担保人年收入', key: 'guarantorAnnualIncome', type: '1' },
        { title: '担保人婚姻状况', key: 'guarantorMarryStatus', type: '6', enumType:'1000154' },
        { title: '担保人居住地址', key: 'guarantorAddress', type: '0' },
        { title: '担保人单位名称', key: 'guarantorEmployerName', type: '0' },
        { title: '担保人单位地址', key: 'guarantorEmployerAddress', type: '0' },
        { title: '担保人单位电话', key: 'guarantorEmployerPhone', type: '0' },
        { title: '担保人担保能力说明', key: 'guarantorDescribe', type: '0' },
        { title: '持卡人姓名', key: 'cardholderName', type: '0' },
        { title: '卡号', key: 'cardNo', type: '0' },
        { title: '开户银行', key: 'bank', type: '0' },
        { title: '开户行号', key: 'bankNo', type: '0' },
        { title: '手机号', key: 'iphoneNo', type: '0' },
        { title: '来源系统', key: 'pkSys.systemName', type: '5' },
    ]
    //主表 列属性定义=>通过前端service工具类自动生成
    gridColumn = [];

    // 子表列属性定义
    // gridOnSon = [
    //     {title:'计划投放日期',key:'plan_date_loan',type:'0'},
    //     {title:'投放金额(元)',key:'plan_cash_loan',type:'0'},
    //     {title:'不含税投放金额(元)',key:'plan_cash_corpus',type:'0'},
    //     {title:'税率',key:'tax_rate',type:'0'},
    //     {title:'税额(元)',key:'tax_cash',type:'0'},
    //     {title:'投放付款方式',key:'pay_method_loan',type:'0'},
    //     {title:'银票开票日期',key:'make_date_draft',type:'0'},
    //     {title:'银票到期日期',key:'end_date_loan',type:'0'},
    //     {title:'银票保证金比例',key:'deposit_ratio4draft',type:'0'},
    //     {title:'银票保证金利率',key:'interrate_ratio4draft',type:'0'},
    //     {title:'计息金额计算方式',key:'calinter_amount_style',type:'0'},
    // ]
    // // 子表 列属性定义=>通过前端service工具类自动生成
    // gridColumnOnSon = [];


    //子页签更改活动key方法
    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
        this.customer.updateState({TabKey:activeKey});
    }


    render() {
        return (
            <div className="grid-parent" style={{ display: this.state.listView }}>
                <div>
                    <GridMain
                        ref={(el) => this.gridref = el} //存模版
                        columns={this.state.gridColumn}         //字段定义
                        data={this.props.list}            //数据数组                     
                        tableHeight={2} //表格高度 1主表 2单表 3子表
                        exportFileName="C端客户信息"　    //导出表格名称
                        exportData={this.props.exportData}      //导出表格数据
                        afterFilter={this.afterFilter}          //过滤列的函数
                        showFilterPopover={this.state.showFilterPopover}  //过滤面板是否显示
                        //分页对象
                        paginationObj={{
                            dataNumSelect:['10','25','50','100'],        //每页显示条数动态修改
                            dataNum:this.props.queryParam.dataNum,            //每页显示条数Index
                            activePage: this.props.queryParam.pageIndex,      //活动页
                            total: this.props.queryObj.total,                 //总条数
                            items: this.props.queryObj.totalPages,            //总页数
                            freshData: this.freshData,                        //活动页改变,跳转指定页数据
                            onDataNumSelect: this.onDataNumSelect,            //每页行数改变,跳转首页
                        }}
                        getSelectedDataFunc={this.getSelectedDataFunc}

                    />
                </div>
                {/* <div> */}
                    {/* <Tabs
                        defaultActiveKey="1"
                        onChange={this.onChange}
                        className="list-tabs"
                    >
                        <TabPane tab='子表1' key="1">
                            <div>
                                <GridMain
                                    ref="son"                       //存模版
                                    columns={this.gridColumnOnSon}  //字段定义
                                    multiSelect={false}             //false 单选，默认多选 
                                    data={this.props.list2}         //数据数组
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