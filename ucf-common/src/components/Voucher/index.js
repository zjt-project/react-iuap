import React, {Component} from "react";
import { Message, Button, Icon, Modal, Table } from 'tinper-bee';
import {deepClone} from "utils";
import { genGridColumn } from "utils/service";
import VoucherDetail from "./VoucherDetail"
import './index.less'

class Voucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refModelUrl: `${GROBAL_HTTP_CTX}/sys/queryVoucher`,   //对应凭证查询的url
            voucherObj:{},                                        //双击选中的单据信息
            detailObj:{},                                         //凭证详情的选中数据
            mainview:'',                                          //初始进入显示主表数据
            detailview:'none',                                    //子表数据需等待双击单条主表数据显示
            detailList: [],                                       //凭证子表列表
        }
        this.voucherList = [];   //凭证列表
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        this.gridColumn = [...genGridColumn(this.grid)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        this.loadData();
    }

    /**
   * @msg: 请求mock数据，包含表头数据和表体数据
   * @param {type}
   * @return:
   */
  loadData = async () => {
    // let data = {
    //     sourceBill : this.props.pk,
    // }
    // let requestList = [
    //   request(this.state.refModelUrl, { method: 'post' , data:data }),//表头数据
    // ];
    // Promise.all(requestList).then(([response]) => {
    //   let data = response.data;
    //   this.voucherList = data;
    // }).catch((e) => {
    //   console.log(e)
    // });
    this.voucherList = [
        {"pkVoucher":1001,"glorg":{"glorgbookname":"2013主体账簿"},"prepareddate":"2019-02-10","voucherno":"记账凭证14","explanation":"收款",
         "totaldebit":100000.555,"totalcredit":100000.555,"prepared":{"userName":"方圆圆"},"casher":{"userName":"武向阳"},"checked":{"userName":"吴亦群"},
         "manager":{"userName":"gaofei"},"aa":"","systemname":"租赁账务","period":12,
         detailList:[
            {"detailNo":1,"memo":"收款","dispname":"银行存款\活期存款\-人民币户","assist":"【银行账户:交通银行股份有限公司】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":1000.55,"loan":0,"aa":""},
            {"detailNo":2,"memo":"收【2015扬州市交通集团】的租金","dispname":"长期应收款\应收融资租赁款","assist":"【合同信息:2015-LX000000-330-001】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":0,"loan":1000.55,"aa":""},
            {"detailNo":3,"memo":"收款","dispname":"银行存款\活期存款\-人民币户","assist":"【银行账户:交通银行股份有限公司】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":1000.55,"loan":0,"aa":""},
            {"detailNo":4,"memo":"收【2015扬州市交通集团】的租金","dispname":"长期应收款\应收融资租赁款","assist":"【合同信息:2015-LX000000-330-001】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":0,"loan":1000.55,"aa":""},
            {"detailNo":5,"memo":"收款","dispname":"银行存款\活期存款\-人民币户","assist":"【银行账户:交通银行股份有限公司】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":1000.55,"loan":0,"aa":""},
            {"detailNo":6,"memo":"收【2015扬州市交通集团】的租金","dispname":"长期应收款\应收融资租赁款","assist":"【合同信息:2015-LX000000-330-001】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":0,"loan":1000.55,"aa":""},
            {"detailNo":7,"memo":"收款","dispname":"银行存款\活期存款\-人民币户","assist":"【银行账户:交通银行股份有限公司】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":1000.55,"loan":0,"aa":""},
            {"detailNo":8,"memo":"收【2015扬州市交通集团】的租金","dispname":"长期应收款\应收融资租赁款","assist":"【合同信息:2015-LX000000-330-001】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":0,"loan":1000.55,"aa":""},
            {"detailNo":9,"memo":"收款","dispname":"银行存款\活期存款\-人民币户","assist":"【银行账户:交通银行股份有限公司】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":1000.55,"loan":0,"aa":""},
            {"detailNo":10,"memo":"收【2015扬州市交通集团】的租金","dispname":"长期应收款\应收融资租赁款","assist":"【合同信息:2015-LX000000-330-001】",
            "pkCurrtype":{"name":"CNY"},"factCash":1000.55,"lend":0,"loan":1000.55,"aa":""},
        ]},
    ];
    if(this.voucherList == undefined || this.voucherList == null || this.voucherList.length <= 0 ){
        this.close();
        Message.destroy();
        Message.config({
            top: 200,
            duration: 3,
        });
        Message.create({content: '未查询到该单据的对应凭证!', color: "dark"});
    }
        
  }


    //凭证主表  列属性定义
    grid = [
        { title: '主体账簿', key: 'glorg.glorgbookname', type: '0',width:100},
        { title: '日期', key: 'prepareddate', type: '3' , width:100},
        { title: '凭证号', key: 'voucherno', type: '0' , width:70},
        { title: '摘要', key: 'explanation', type: '0' , width:70},
        { title: '借方', key: 'totaldebit', type: '7', digit: 2 , width:100},
        { title: '贷方', key: 'totalcredit', type: '7' , digit: 2 , width:100},
        { title: '制单', key: 'prepared.userName', type: '0' , width:80},
        { title: '出纳', key: 'casher.userName', type: '0' , width:80},
        { title: '审核', key: 'checked.userName', type: '0' , width:80},
        { title: '记账', key: 'manager.userName', type: '0' , width:80},
        { title: '备注', key: 'aa', type: '0' ,width:60},
        { title: '系统', key: 'systemname', type: '0' , width:100},
        { title: '期间', key: 'period', type: '1', width:80 },
    ];


    //行双击事件 将双击行数据的主子表数据赋值  显示子表列表
    onRowDoubleClick = (record, index, event) =>{
        let formObj = deepClone(record);
        if(formObj.detailList != undefined && formObj.detailList != null && formObj.detailList.length > 0){
            this.setState({detailList:formObj.detailList});
        }
        this.setState({voucherObj:formObj,mainview:'none',detailview:''}); 
    }

    close = () =>{
        this.Return();
        this.props.closeVoucher();
    }

    //子表页面数据返回至主表列表按钮
    Return = () =>{
        //清空子表数据
        this.detailList = [];
        this.setState({mainview:'',detailview:'none'});
    }

    
    render() {
        if(this.voucherList == undefined || this.voucherList == null || this.voucherList.length <= 0 ){
            return (
                <div></div>
            );
        }else{
            return (
                <div className='voucher_main'>
                        <Modal
                            show={this.props.showVoucherModal}
                            onHide={this.close}
                            size="lg"
                            backdrop="static"
                            centered="true"
                            width="960px"
                            dialogClassName="modal_form"
                        > 
                        <div className="modal_header">
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    凭证信息
                                </Modal.Title>
                            </Modal.Header>
                        </div>

                        <Modal.Body>
                            <div style={{display:this.state.mainview}}>
                                <div className="steps-contents">
                                    <Table
                                        ref="voucherlist"               //存模版
                                        columns={this.gridColumn}       //字段定义
                                        rowKey={(r, i) => {return i}}   //唯一性key
                                        multiSelect={false}             //false 单选，默认多选 
                                        data={this.voucherList}         //数据数组
                                        size = "sm"                     //紧凑型表格
                                        bordered={true}                 //边框
                                        headerDisplayInRow={true}       //表头换行用...来表示
                                        bodyDisplayInRow={true}         //表体换行用...来表示
                                        hideHeaderScroll={false}        //无数据时是否显示表头 
                                        dragborder={true}               //表头可拖拽 
                                        onRowDoubleClick = {this.onRowDoubleClick}
                                        //分页对象
                                        paginationObj={{
                                            verticalPosition: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{display:this.state.detailview}}>
                                <div>
                                    <VoucherDetail {...this.props} updateList ={this.updateList} Return ={this.Return} voucherObj ={this.state.voucherObj} detailList = {this.state.detailList}  />
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            );
        }
    }
}

export default Voucher;
