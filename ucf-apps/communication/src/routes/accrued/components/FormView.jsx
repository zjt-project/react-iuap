import React, { Component } from 'react';
import {actions} from "mirrorx";
import { Form, Icon, Button, Label, Select, Col, FormControl, Collapse, Tabs, ButtonGroup,Panel } from 'tinper-bee';
import { deepClone, getHeight } from "utils";
import DatePicker from "tinper-bee/lib/Datepicker";
import FormInputNumber from 'components/FormRef/FormInputNumber';
import TableFormRef from 'components/FormRef/TableFormRef';
import TableTreeRef from 'components/FormRef/TableTreeRef';
import {genGridColumn} from "utils/service";
import GridMain from 'components/GridMain';
import '../../../../../../ucf-common/src/styles/public.less'
import './index.less';
import {singleRecordOper, multiRecordOper} from "utils/service";
import LoanModalView from './LoanModalView';
import { Empty } from 'antd';
import Grid from 'components/Grid';
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
        let obj =Object.assign(this.props.form.getFieldsValue(), {pkOrg:this.props.formObject.pkOrg});
        return obj;
    }

    //子表切换子标签  当存在多个子标签时调用函数更改活动key
    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
        this.updateState({TabKey:activeKey});
    }

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
    }

    //子表添加数据
    // add = () => {
    //     if(this.state.activeKey == '1'){
    //         actions.communicationAccrued.updateState({planformObj:{},ifplanAdd:true,showLoanModal:true})
    //     }
    // }
    //子表更新数据 更新删除数据时 一定要进行深克隆后对克隆数据进行处理 然后更新原数据 否则很容易报错!
    // onEdit = () => {
    //     if(this.state.activeKey == '1'){
    //         singleRecordOper(this.props.selectedPlanList,(param) => {
    //             let _planformObj = deepClone(this.props.selectedPlanList[0]);
    //             actions.communicationAccrued.updateState({planformObj:_planformObj,showLoanModal:true});
    //         });
    //     }
    // }
    //子表删除数据
    del = () =>{
        multiRecordOper(this.props.selectedPlanList,(param) => {
            if(this.state.activeKey == '1'){
                let selectedPlanList = deepClone(this.props.selectedPlanList);
                let planlist = deepClone(this.props.list3);
                selectedPlanList.map(item => {
                    delete planlist[item['_index']];
                });
                let newlist = [];
                planlist.map(item => {
                    if(item!=Empty){
                        newlist.push(item);
                    }
                });
                this.handleChange(); //删除子表 重算主表数据
                actions.communicationAccrued.updateState({ list3 : newlist,selectedPlanList:[] });  
            }
        });   
    }

    //删除子表 重算主表数据
    handleChange = () =>{
        let objectForm = this.props.form.getFieldsValue();
        let interestAmount = objectForm.interestAmount; //利息
        let feeAmount = objectForm.feeAmount; //手续费
        let otherIncomeAmount = objectForm.otherIncomeAmount; //其他收入
        let otherExpensesAmount = objectForm.otherExpensesAmount; //其他支出
        let _selectedPlanList = deepClone(this.props.selectedPlanList); //当前选中的数据
        _selectedPlanList.map(item => {
            interestAmount = interestAmount - item.interestAmount;
            feeAmount = feeAmount - item.feeAmount;
            otherIncomeAmount = otherIncomeAmount - item.otherIncomeAmount;
            otherExpensesAmount = otherExpensesAmount - item.otherExpensesAmount;
        });
        this.props.form.setFieldsValue({'interestAmount':interestAmount, 'feeAmount': feeAmount
                                        , 'otherIncomeAmount':otherIncomeAmount, 'otherExpensesAmount':otherExpensesAmount});
    }

    //子表选中数据事件  动态调整表格前的复选框
    getSelectedDataFunc = (selectedPlanList,record,index) => {
        if(this.state.activeKey =='1'){
            let {list3} = this.props;
            let _list2 = deepClone(list3);
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
            
            actions.communicationAccrued.updateState({ list3 : _list2,selectedPlanList : _selectedPlanList});
        }
    }

    getValue = (formObject,value) =>{
        if(formObject != undefined && value.indexOf('.')>0){
            let field = value.substr(value.indexOf('.')+1);
            value = value.substring(0,value.indexOf("."));
            formObject = formObject[value];
            return this.getValue(formObject,field);
        }
        return formObject == undefined?"":formObject[value];
    }


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
    mainForm1 = [
        { label: '计提月份', field: 'accrualMonth', com: DatePicker, format: 'YYYY-MM', required: true },
        { label: '租赁利息计提', field: 'interestAmount', com: FormInputNumber, required: true, toThousands: true, precision: 2 },
        { label: '手续费收入计提总额', field: 'feeAmount', com: FormInputNumber, required: true, toThousands: true, precision: 2 },
        { label: '其他收入计提总额', field: 'otherIncomeAmount', com: FormInputNumber, required: true, toThousands: true, precision: 2},
        { label: '其他支出计提总额', field: 'otherExpensesAmount', com: FormInputNumber, required: true, toThousands: true, precision: 2},
        // { label: '签约主体', field: 'pkOrg', com: TableFormRef, required: true ,refurl:'/sys/queryOrg'},
        { label: '签约主体', field: 'pkGlorgbook.glorgbookname', com: FormControl, required: true },
    ]


    /**
     *表格列属性定义 title:属性中文名  key:字段名称  type:封装在service.js中的枚举类型 具体类型控制见js
     */
    gridOnTheLoan = [
        { title: '客户名称', key: 'customerName', type: '0' },
        // { title: '合同名称', key: 'pkContract.contName', type: '0' },
        { title: '合同编号', key: 'pkContract.contCode', type: '0' },
        { title: '起租流程', key: 'leaseFlow', type: '6', enumType :'leaseFlow' },
        // { title: '资产状态', key: 'assetStatus', type: '0' },
        { title: '资产五级分类', key: 'assetsClassify', type: '6', enumType :'assetsClassify' },
        // { title: '计税方式', key: 'assetStatus', type: '0' },
        // { title: '部门名称', key: 'aaa', type: '0' },
        { title: '计提月份', key: 'accruedMonth', type: '0' },
        { title: '租赁利息计提金额', key: 'interestAmount', type: '7', digit: 2 },
        { title: '手续费收入计提金额', key: 'feeAmount', type: '7', digit: 2 },
        { title: '其他收入计提金额', key: 'otherIncomeAmount', type: '7', digit: 2 },
        { title: '其他支出计提金额', key: 'otherExpensesAmount', type: '7', digit: 2},
        { title: '币种', key: 'pkCurrtype.currtypename', type: '0' },
        { title: '汇率', key: 'exchgRate', type: '7', digit: 6 },
        { title: '核算主体', key: 'pkGlorgbook.glorgbookname', type: '0' },
        // { title: '租赁方式', key: 'bbb', type: '0' },
        // { title: '税目类别', key: 'ccc', type: '0' },
        // { title: '资产类型', key: 'ddd', type: '0' }
    ]
    // 投放计划 列属性定义=>通过前端service工具类自动生成
    gridColumnOnTheLoan = [];

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let _formObject = this.props.formObject;
        let formObject = deepClone(_formObject);
        let _props = this.props;
        const { tableHeightChild} = this.state;
        const loop = data => data.map((value, key) => {
            return (
                <Col md={value.col ? value.col : 4} xs={value.col ? value.col : 4} sm={value.col ? value.col : 4}>
                    <FormItem
                        className={(value.col === 12 ? (value.class && value.class === 'textarea' ? "remark flex jic-textArea" : "remark flex ") : '')}>
                        <Label className={value.col === 12 ? "line-height-32" : ''}>
                            {(value.required && value.required === true) ?
                                <Icon type="uf-mi" className='mast'></Icon> : ''}
                            {value.label}
                        </Label>
                        <value.com {...this.props}
                                   title={value.label}
                                   name={value.field}
                                   format={value.format}
                                   disabled={true}
                                   data={value.data ? value.data : ''}
                                   refurl={value.refurl}
                                   toThousands={value.com === FormInputNumber ? (value.toThousands ? value.toThousands : true) : ''}  //是否显示千分位
                                   precision={value.com === FormInputNumber ? (value.precision ? value.precision : 2) : ''} //保留2位小数
                                   componentClass={value.class ? value.class : 'input'}
                                   {
                                       ...getFieldProps(value.field, {
                                           initialValue:value.field&&value.field.indexOf(".")>0 ? this.getValue(formObject,value.field): formObject[value.field],
                                           rules: [{
                                               required: true,
                                           }],
                                       })
                                   }>
                        </value.com>
                    </FormItem>
                </Col>)
        });
        if (_props.showForm) {
            return (
                <div>
                    <div className='jic-form'>
                        <div className = 'jic-form-content-accrued'>
                        <Panel header={this.state.open ? <Icon type="uf-reduce-c-o">投放信息</Icon>:<Icon type="uf-add-c-o">投放信息</Icon>} eventKey="1" collapsible defaultExpanded="true" expanded={this.state.open} onSelect={this.handleSelect.bind(this,'1')} >
                            <Form>
                                {loop(this.mainForm1)}
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
                            // extraContent={
                            //     <div className="addAndDelChildList demoPadding" style={{ display: _props.isEdit ? '' : 'none' }} >
                            //         <ButtonGroup style={{ margin: 1 }}>
                            //             {/* <Button shape='border' onClick={this.add}><Icon type='uf-add-c-o' /></Button> */}
                            //             {/* <Button shape="border" onClick={this.onEdit}><Icon type='uf-pencil-s'/></Button> */}
                            //             <Button shape='border' onClick={this.del.bind(this)}><Icon type='uf-reduce-c-o' /></Button>
                            //         </ButtonGroup>
                            //     </div>
                            // }
                        >
                            <TabPane tab='子表信息' key="1"> 
                           <div>
                                <GridMain
                                    ref={(el) => this.gridOnTheLoan = el} //存模版
                                    columns={this.gridColumnOnTheLoan} //字段定义
                                    data={this.props.list3} //数据数组
                                    tableHeight={1} //表格高度 1主表 2字表
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
                    {/* <div>
                        <LoanModalView {...this.props} />         
                    </div> */}

                </div>
            );

        } else {
            return <div></div>
        }

    }
}

export default Form.createForm()(FormView);