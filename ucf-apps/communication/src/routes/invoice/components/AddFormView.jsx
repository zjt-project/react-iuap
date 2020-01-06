/**
 *
 * @title 结合切换事件的 Step组件完成主页面模态框形式新增数据
 * @description 点击next，Step的流程跟进
 *
 */
import React, { Component } from 'react';
import { Step, Button, Message, Modal, Form, Icon, Label, Col, Row, Select, FormControl, Tabs } from 'tinper-bee';
import { actions } from 'mirrorx';
import { deepClone,getHeight } from "utils";
import Grid from 'components/Grid';
import {genGridColumn,checkListSelect} from "utils/service";
import './index.less';

// const Steps = Step.Steps;         //步骤条组件使用定义 如不定义则只能使用Step.Steps 此处定义全局变量是为了方便使用
const addTitle = "基本信息";       //模态框标题
// const steps = [                   //步骤条每步使用标题  对应嵌套模态框内部标题
//     { title: '基本信息' }
// ];

class AddFormView extends Component {
    constructor(props) {

        super(props);
        this.state = {
            current: 0,        //初始模态框进入页签参数
            showDiv1: '',      //控制模态框内部每个页签的显示隐藏 为''时显示 为none时隐藏
            tableHeight: 0,
        };
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //计算表格滚动条高度
        // this.resetTableHeight(false);
        this.addGridColumn = [...genGridColumn(this.addGrid)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
    }
    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
    }


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

    //点击保存存储对应新增数据 移除缓存 并重置模态框
    alertDone = () => {

        actions.communicationInvoice.saveInvoice(this.props.addSelectedList);
        this.close();
    };
    //关闭模态框
    close = () => {
        actions.communicationInvoice.updateState({ showModal: false, list1: [] });
    };
    /**
     * 跳转到指定页数据
     * @param {Number} pageIndex 跳转指定页数
     */
    freshData = (pageIndex) => {
        let queryParam = deepClone(this.props.addQueryParam); // 深拷贝查询条件从 action 里
        queryParam['pageIndex'] = pageIndex;
        actions.communicationInvoice.loadList(queryParam);
    };

    getSubSelectedDataFunc = (selectedList, record, index) => {
        let { list1 } = this.props;
        let _list = deepClone(list1);
        let _selectedList = deepClone(selectedList);
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
        actions.communicationInvoice.updateState({ list1: _list, addSelectedList: _selectedList });
    };

    addGrid = [
        { title: '合同编号', key: 'contCode', type: '0' },
        { title: '合同名称', key: 'contName', type: '0' },
        { title: '发票抬头', key: 'invoiceTitle', type: '0' },
        { title: '起租流程', key: 'leaseFlow', type: '0' },
        { title: '税号', key: 'ein', type: '0' },
        { title: '单位地址', key: 'employerAddress', type: '0' },
        { title: '电话号码', key: 'telephoneNumber', type: '0' },
        { title: '开户银行', key: 'openingBank', type: '0' },
        { title: '银行账号', key: 'bankAccount', type: '0' },
        { title: '邮寄地址', key: 'mailingAddress', type: '0' },
        { title: '客户名称', key: 'customerName', type: '0' },
        { title: '单位名称', key: 'employerName', type: '0' },
        { title: '电话号码', key: 'telephoneNumber', type: '0' },
        { title: '租赁方式', key: 'leaseType', type: '0' },
        { title: '期次', key: 'leaseTime', type: '0' },
        { title: '应收日期', key: 'planDate', type: '0' },
        { title: '租赁方式', key: 'leaseType', type: '0' },
        { title: '税率', key: 'taxRate', type: '0' },
        { title: '税额', key: 'leaseCashTax', type: '0' },
        { title: '不含税金额', key: 'excludingTax', type: '0' },
        { title: '开票状态', key: 'billingStatus', type: '0' },
        { title: '开票内容', key: 'invoiceContents', type: '0' },
        { title: '公司主体', key: 'companyMainBody', type: '0' }

    ];
    //列属性定义=>通过前端service工具类自动生成
    addGridColumn = [];

    render() {
        let { tableHeight} = 600;
        if (this.props.showModal == false) {
            return <div></div>;
        } else {
            return (
                <div>
                    {/**
                     模态框组件Modal 主组件使用className控制自定义属性  show控制显示隐藏  backdrop static代表固定遮罩层 size控制尺寸 onHide关闭事件
                     拥有三层子组件 分别为 Modal.Header  Modal.Body  Modal.Footer 其中
                     Modal.Header: 模态框的头部 通过Modal.Title 定义模态框的标题
                     Modal.Body:   模态框的内容体 显示主题内容在内部定义
                     Modal.Footer: 模态框的尾部 显示按钮在此处定义 也可定义在Body中不加Footer体
                     */}
                    <Modal
                        className="jic-model"
                        show={this.props.showModal}
                        backdrop="static" //关闭遮罩事件
                        size={"xlg"} //大号模态框
                        onHide={this.close}>
                        <Modal.Header closeButton>
                            <Modal.Title > {addTitle} </Modal.Title>
                        </Modal.Header >
                        <Modal.Body >
                            {
                                /**
                                 * 步骤条组件Steps 展示当前步骤条属性 current
                                 * 单个步骤条子组件Step key为唯一性索引 title为步骤条标题
                                 */
                            }
                            <div className="grid-parent">
                                <Grid
                                    ref={(el) => this.addGrid = el} //存模版
                                    columns={this.addGridColumn} //字段定义
                                    data={this.props.list1} //数据数组
                                    rowKey={(r, i) => {r._index = i; return i}} //生成行的key
                                    multiSelect={true}  //false 单选，默认多选
                                    scroll={{y: tableHeight}} //滚动轴高度
                                    height={28} //行高度
                                    bordered //表格有边界
                                    headerDisplayInRow={true}//表头换行用...来表示
                                    bodyDisplayInRow={true}//表体换行用...来表示
                                    headerHeight={40} //表头高度
                                    bodyStyle={{'height':tableHeight,'background-color':'rgb(241, 242, 245)'}} //表体样式
                                    sheetHeader={{height: 30, ifshow: false}} //设置excel导出的表头的样式、支持height、ifshow
                                    hideHeaderScroll={false} //无数据时是否显示表头
                                    //排序属性设置
                                    sort={{
                                        mode: 'multiple', //多列排序
                                        backSource: false, //前端排序
                                    }}
                                    //分页对象
                                    paginationObj = {{
                                        activePage : this.props.addQueryParam.pageIndex,//活动页
                                        total : this.props.total,//总条数
                                        items: this.props.addQueryObj.totalPages,//总页数
                                        freshData: this.freshData, //活动页改变,跳转指定页数据
                                        dataNumSelect:['5','25','50','100'],
                                        dataNum:2,
                                        onDataNumSelect: this.onDataNumSelect, //每页行数改变,跳转首页
                                        verticalPosition:'bottom'
                                    }}
                                    rowClassName={(record,index,indent)=>{
                                        if (record._checked) {
                                            return 'selected';
                                        } else {
                                            return '';
                                        }
                                    }}
                                    // onRowClick={this.onRowSelect}
                                    getSelectedDataFunc={this.getSubSelectedDataFunc}
                                />
                            </div>
                            <div className="steps-action">
                                <Button colors="primary" style={{marginRight: 8}}
                                        onClick={() => this.alertDone()}>完成</Button>
                                <Button colors="secondary" onClick={() => this.close()}> 关闭 </Button>
                            </div>



                        </Modal.Body>
                    </Modal>
                </div>
            );
        }
    }
}
export default Form.createForm()(AddFormView);
