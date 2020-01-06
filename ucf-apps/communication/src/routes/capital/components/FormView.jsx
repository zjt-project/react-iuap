import React, {Component} from 'react';
import {actions} from "mirrorx";
import {Button, ButtonGroup, Col, Collapse, Form, FormControl, Icon, Label, Panel, Select, Tabs} from 'tinper-bee';
import {deepClone} from "utils";
import DatePicker from "tinper-bee/lib/Datepicker";
import FormInputNumber from 'components/FormRef/FormInputNumber';
import {genGridColumn, singleRecordOper} from "utils/service";
import GridMain from 'components/GridMain';
import '../../../../../../ucf-common/src/styles/public.less'
import './index.less';
import LoanModalView from './LoanModalView';
import {Empty} from 'antd';

const { TabPane } = Tabs;
const FormItem = Form.FormItem;

class FormView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 1, //子页签默认活动key
            open: true,   //各个小标签的展开与收缩
            open2: true,
            open3: true,
            open4: true,
            open5: true,
            open6: true,
        };
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //渲染前首先使用工具加载表格的列标题
        this.gridColumnOnTheLoan = [...genGridColumn(this.gridOnTheLoan)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        this.props.onRef(this); //绑定子组件
    }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
    }

    //保存方法 供父组件调用 读取当前表单内部页面的更改属性
    submit = () => {
        return this.props.form.getFieldsValue();
    };

    //子表切换子标签  当存在多个子标签时调用函数更改活动key
    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };

    //编辑Panel是否展开折叠
    handleSelect = (key)=> {
        if(key =='1'){
            this.setState({open:!this.state.open});
        }else if(key =='2'){
            this.setState({open2:!this.state.open2});
        }else if(key =='3'){
            this.setState({open3:!this.state.open3});
        }else if(key =='4'){
            this.setState({open4:!this.state.open4});
        }else if(key =='5'){
            this.setState({open5:!this.state.open5});
        }else if(key =='6'){
            this.setState({open6:!this.state.open6});
        }
    };

    //子表添加数据
    add = () => {
        if(this.state.activeKey == '1'){
            actions.communicationCapital.updateState({planformObj:{},ifplanAdd:true,showLoanModal:true})
        }
    };
    //子表更新数据 更新删除数据时 一定要进行深克隆后对克隆数据进行处理 然后更新原数据 否则很容易报错!
    onEdit = () => {
        if(this.state.activeKey == '1'){
            singleRecordOper(this.props.selectedPlanList,(param) => {
                let _planformObj = deepClone(this.props.selectedPlanList[0]);
                actions.communicationCapital.updateState({planformObj:_planformObj,showLoanModal:true});
            });
        }
    };
    //子表删除数据
    del = () =>{
        if(this.state.activeKey == '1'){
            let selectedPlanList = deepClone(this.props.selectedPlanList);
            let planlist = deepClone(this.props.list2);
            selectedPlanList.map(item => {
                delete planlist[item['_index']];
            });
            let newlist = [];
            planlist.map(item => {
                if(item!=Empty){
                    newlist.push(item);
                }
            });
            actions.communicationCapital.updateState({ list2 : newlist,selectedPlanList:[] });
        }
    };

    //子表选中数据事件  动态调整表格前的复选框
    getSelectedDataFunc = (selectedPlanList,record,index) => {
        if(this.state.activeKey =='1'){
            let {list2} = this.props;
            let _list2 = deepClone(list2);
            let _selectedPlanList = deepClone(selectedPlanList);
            if(index!=undefined){
                _list2[index]['_checked'] = !_list2[index]['_checked'];
            }else {
                if(_selectedPlanList && _selectedPlanList.length > 0){
                    _list2.map(item => {
                        if (!item['_disabled']) {
                            item['_checked'] = true;
                        }
                    });
                } else {
                    _list2.map(item => {
                        if (!item['_disabled']) {
                            item['_checked'] = false;
                        }
                    });
                }
            }
            actions.communicationCapital.updateState({ list2 : _list2,selectedPlanList : _selectedPlanList});
        }
    };
    /**
     * 表单内部数据处理通用写入格式
     * label:属性名称
     * field:属性字段值
     * com:对应组件名称 包含FormControl(输入框) TableFormRef(参照框) Select(下拉框) DatePicker(日期选取框) FormInputNumber(数字金额框)
     * required:必输项控制
     * data:对应Select下拉框中的选取数据
     * format:对应日期选取框的格式化格式
     * toThousands:对应数字金额框的千分位是否展示
     * precision:对应数字金额框的小数位精度
     */
// { label: '本金是否开票', field: 'if_corpus_tickets', com: Select, required: true, data: [{ key: '是', value: '0' }, { key: '否', value: '1' }] },
// { label: '测算方案名称', field: 'quot_name', com: FormControl, required: true },
// { label: '投放日期', field: 'plan_date_loan', com: DatePicker, required: true, format: 'YYYY-MM-DD' },
// { label: '租赁本金', field: 'fact_cash_loan', com: FormInputNumber, required: true, toThousands: true, precision: 2 },

mainForm1 = [
    { label: '付款交易批次号', field: 'capitalBatchNo', com: FormControl, required: true },
    { label: '应收金额', field: 'receivableAmount', com: FormInputNumber, required: true, toThousands: true, precision: 2 },
    { label: '到账金额', field: 'intoAccountAmount', com: FormInputNumber, required: true , toThousands: true, precision: 2},
    { label: '到账日期', field: 'intoAccountDate', com: DatePicker, required: true, format: 'YYYY-MM-DD' },
    { label: '是否逾期', field: 'ifOverdue', com: Select, required: true, data: [{ key: '已逾期', value: 0 }, { key: '未逾期', value: 1 }]},
    { label: '抵扣状态', field: 'deductionStatus', com: Select, required: true, data: [{ key: '未抵扣', value: 0 }, { key: '已抵扣', value: 1 }, { key: '已归还', value: 2 }]},
    { label: '抵扣日期', field: 'deductionDate', com: DatePicker, required: true, format: 'YYYY-MM-DD' },
    { label: '租赁方式', field: 'ifOverdue', com: Select, required: true, data: [{ key: '直租', value: 0 }, { key: '回租', value: 1 }] },
    { label: '币种', field: 'pkCurrency.currtypename', com: FormControl, required: true},
    { label: '公司主体', field: 'companyBody', com: FormControl, required: true},
    { label: '来源系统', field: 'pkSys', com: FormControl, required: true}
    ];



    /**
     *表格列属性定义 title:属性中文名  key:字段名称  type:封装在service.js中的枚举类型 具体类型控制见js
     */
    gridOnTheLoan = [
        { title: '收款批次', key: 'capitalBatchNo', type: '0' },
        { title: '合同编号', key: 'contCode', type: '0' },
        { title: '合同名称', key: 'contName', type: '0' },
        { title: '客户名称', key: 'customerName', type: '0' },
        { title: '单位名称', key: 'employerName', type: '0' },
        { title: '租赁方式', key: 'leaseType', type: '0' },
        { title: '事件类别', key: 'eventType', type: '0' },
        { title: '期次', key: 'periodTime', type: '0' },
        { title: '应收日期', key: 'receivableDate', type: '0' },
        { title: '应收金额', key: 'receivableAmount', type: '0' },
        { title: '应收本金', key: 'receivableCorpus', type: '0' },
        { title: '应收利息', key: 'receivableInterest', type: '0' },
        { title: '剩余本金', key: 'surplusCorpus', type: '0' },
        { title: '到账金额', key: 'intoAccountAmount', type: '0' },
        { title: '到账日期', key: 'intoAccountDate', type: '0' },
        { title: '核销状态', key: 'verificationState', type: '0' },
        { title: '核销日期', key: 'verificationDate', type: '0' },
        { title: '收款银行', key: 'gatherBank', type: '0' },
        { title: '收款帐号', key: 'gatherAccount', type: '0' },
        { title: '核销金额', key: 'gatherBalance', type: '0' },
        { title: '应收余额', key: 'receivableBalance', type: '0' },
        { title: '实收本金', key: 'paidinCorpus', type: '0' },
        { title: '实收利息', key: 'paidinInterest', type: '0' },
        { title: '是否逾期', key: 'ifOverdue', type: '0' },
        { title: '币种', key: 'pkCurrency.currtypename', type: '0' },
        { title: '公司主体', key: 'companyBody', type: '0' },
        { title: '来源系统', key: 'pkSys', type: '0' },
    ];
    // 投放计划 列属性定义=>通过前端service工具类自动生成
    gridColumnOnTheLoan = [];

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let _formObject = this.props.formObject;
        let formObject = deepClone(_formObject);
        let _props = this.props;
        if (_props.showForm) {
            return (
                <div>
                    <div className='jic-form'>
                        <div className = 'jic-form-content'>
                            <Panel header={this.state.open ? <Icon type="uf-reduce-c-o">基本信息</Icon>:<Icon type="uf-add-c-o">基本信息</Icon>} eventKey="1" collapsible defaultExpanded="true" expanded={this.state.open} onSelect={this.handleSelect.bind(this,'1')} >
                                <Form>
                                    {
                                        this.mainForm1.map((value, key) => {
                                            return (
                                                <Col md={4} xs={4} sm={4}>
                                                    <FormItem>
                                                        <Label>
                                                            <Icon type="uf-mi" className='mast'></Icon>
                                                            {value.label}
                                                        </Label>
                                                        {/**
                                                         表单内容循环渲染的通用格式
                                                         */}
                                                        <value.com {...this.props}
                                                                   title={value.label}
                                                                   name={value.field}
                                                                   format={value.format}
                                                                   iconStyle={value.iconStyle}
                                                                   toThousands={value.toThousands}
                                                                   precision={value.precision}
                                                                   toPercent={value.toPercent}
                                                                   disabled={!_props.isEdit}
                                                                   data={value.data}
                                                                   refurl={value.refurl}
                                                                   {
                                                                       ...getFieldProps(value.field, {
                                                                           initialValue: formObject[value.field],
                                                                           rules: [{
                                                                               required: true,
                                                                           }],
                                                                       })
                                                                   }>
                                                        </value.com>
                                                    </FormItem>
                                                </Col>)
                                        })
                                    }

                                </Form>
                            </Panel>


                        </div>
                    </div>



                    <div className="childListView">
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
                                <div className="addAndDelChildList demoPadding" style={{ display: _props.isEdit ? '' : 'none' }} >
                                    <ButtonGroup style={{ margin: 1 }}>
                                        <Button shape='border' onClick={this.add}><Icon type='uf-add-c-o' /></Button>
                                        <Button shape="border" onClick={this.onEdit}><Icon type='uf-pencil-s'/></Button>
                                        <Button shape='border' onClick={this.del}><Icon type='uf-reduce-c-o' /></Button>
                                    </ButtonGroup>
                                </div>
                            }
                        >
                            <TabPane tab='收款明细表' key="1">
                                <div>
                                    <GridMain
                                        ref={(el) => this.gridOnTheLoan = el} //存模版
                                        columns={this.gridColumnOnTheLoan} //字段定义
                                        data={this.props.list2} //数据数组
                                        //分页对象
                                        paginationObj = {{
                                            verticalPosition:'none'
                                        }}
                                        getSelectedDataFunc={this.getSelectedDataFunc}
                                    />
                                </div>

                            </TabPane>
                        </Tabs>
                    </div>
                    {/**所有页面内部添加组件必须由html内部标签如div标签等包裹 便于维护样式 且避免报错 */}
                    <div>
                        <LoanModalView {...this.props} />
                    </div>

                </div>
            );

        } else {
            return <div></div>
        }

    }
}

export default Form.createForm()(FormView);
