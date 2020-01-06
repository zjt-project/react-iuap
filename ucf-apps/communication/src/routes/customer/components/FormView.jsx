import React, { Component } from 'react';
import {actions} from "mirrorx";
import { Form, Icon, Button, Label, Select, Col, FormControl, Collapse, Tabs, ButtonGroup,Panel, Timeline, Anchor } from 'tinper-bee';
import { deepClone } from "utils";
import DatePicker from "tinper-bee/lib/Datepicker";
import FormInputNumber from 'components/FormRef/FormInputNumber';
import {genGridColumn} from "utils/service";
import GridMain from 'components/GridMain';
import PositionScroll from 'components/PositionScroll';
import '../../../../../../ucf-common/src/styles/public.less'
import './index.less';
import {singleRecordOper} from "utils/service";
import LoanModalView from './LoanModalView';
import { Empty } from 'antd';
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
            // 页面滚动每部分信息; 
            scrollData:[{
                id: "#open", text: "客户基本信息", flag: true
            }, {
                id: "#open2", text: "征信信息", flag: true
            },
            {
                id: "#open3", text: "紧急联系人", flag: true
            },
            {
                id: "#open4", text: "配偶信息", flag: true
            },
            {
                id: "#open5", text: "担保信息", flag: true
            },
            {
                id: "#open6", text: "银行卡信息", flag: true
            }],
            };
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //渲染前首先使用工具加载表格的列标题
        this.gridColumnOnSon = [...genGridColumn(this.gridOnSon)];
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

    //子表点击悬浮的回调
    childPosition = (item, title, index) => {
        this.childTabInfo(title, index)
    }

    //子表添加数据
    add = () => {
        if(this.state.activeKey == '1'){
            actions.customer.updateState({planformObj:{},ifplanAdd:true,showLoanModal:true})
        }
    }
    //子表更新数据 更新删除数据时 一定要进行深克隆后对克隆数据进行处理 然后更新原数据 否则很容易报错!
    onEdit = () => {
        if(this.state.activeKey == '1'){
            singleRecordOper(this.props.selectedPlanList,(param) => {
                let _planformObj = deepClone(this.props.selectedPlanList[0]);
                actions.customer.updateState({planformObj:_planformObj,showLoanModal:true});
            });
        }
    }
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
            actions.customer.updateState({ list2 : newlist,selectedPlanList:[] });  
        }
    }

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
            actions.customer.updateState({ list2 : _list2,selectedPlanList : _selectedPlanList});
        }
    }

    mainForm1 = [
        { label: '客户编码', field: 'customerCode', com: FormControl, required: true },
        { label: '客户名称', field: 'customerName', com: FormControl, required: true },
        { label: '证件类型', field: 'identityType', com: Select, required: true, data: [{ key: '身份证', value: '0' }, { key: '执照', value: '1' },{ key: '驾照', value: '2' },{ key: '护照', value: '3' },{ key: '其他', value: '4' }]  },
        { label: '证件号码', field: 'identityNo', com: FormControl, required: true },
        { label: '出生日期', field: 'birthday', com: DatePicker, required: true, format: 'YYYY-MM-DD' },
        { label: '签发机关', field: 'issuingAuthority', com: FormControl, required: true },
        { label: '有效期限', field: 'validTerm', com: FormInputNumber, required: true },
        { label: '年龄', field: 'age', com: FormInputNumber, required: true },
        { label: '性别', field: 'sex', com: Select, required: true , data: [{ key: '男', value: '0' }, { key: '女', value: '1' }]},
        { label: '文化程度', field: 'levelOfEducation', com: Select,data: [{ key: '研究生', value: '0' }, { key: '本科', value: '1' }, { key: '专科', value: '2' }, { key: '中专', value: '3' }, { key: '高中', value: '4' }, { key: '初中', value: '5' }, { key: '小学', value: '6' }, { key: '未知', value: '7' }]},
        { label: '联系方式', field: 'contact', com: FormControl, required: true },
        { label: '婚姻状况', field: 'marryStatus', com: Select,　data: [{ key: '已婚', value: '0' }, { key: '未婚', value: '1' },{ key: '离异', value: '2' },{ key: '丧偶', value: '3' }] },
        { label: '子女上学情况', field: 'childrenSchoolStatus', com: FormControl },
        { label: '行业类型', field: 'industryType', com: FormControl },
        { label: '职称', field: 'officalTitle', com: Select,　data: [{ key: '高级', value: '0' }, { key: '中级', value: '1' },{ key: '初级', value: '2' },{ key: '无', value: '3' },{ key: '未知', value: '4' }]  },
        { label: '职业', field: 'job', com: FormControl },
        { label: '户籍地址', field: 'permanentAddress', com: FormControl,required: true },
        { label: '居住地址', field: 'homeAddr', com: FormControl,required: true },
        { label: '单位名称', field: 'employerName', com: FormControl,required: true },
        { label: '单位地址', field: 'employerAddress', com: FormControl,required: true },
        { label: '单位性质', field: 'employerNature', com: FormControl },
        { label: '本单位工作年限', field: 'lengthOfService', com: Select, data: [{ key: '3年以下', value: '0' }, { key: '3-10年', value: '1' }, { key: '10年以上', value: '2' }] },
        { label: '本地居住年限(年)', field: 'lengthLocalResidence', com: FormInputNumber },
        { label: '是否有房产', field: 'realEstate', com: FormControl, data: [{ key: '是', value: '0' }, { key: '否', value: '1' }] },
        { label: '产权所有人', field: 'titleHolder', com: FormControl },
        { label: '房产面积(平方米)', field: 'theHousingArea', com: FormInputNumber , precision: 2 },
        { label: '房产所在地', field: 'realEstateHome', com: FormControl },
        { label: '详细地址', field: 'detailedAddress', com: FormControl },
        { label: '房产性质', field: 'realEstateProperties', com: FormControl },
        { label: '房产区域', field: 'realEstateArea', com: FormControl },
        { label: '年固定收入(元)', field: 'fixedAnnualIncome', com: FormInputNumber ,toThousands: true, precision: 2 },
    ]

    mainForm2 = [
        { label: '征信时间', field: 'creditTime', com: DatePicker,format: 'YYYY-MM-DD HH:mm:ss' },
        { label: '征信对象类型', field: 'creditObjType', com: FormControl },
        { label: '征信结果', field: 'creditResult', com: FormControl },
        { label: '征信原因描述', field: 'creditReasonDescribe', com: FormControl } ,
        { label: '征信评分', field: 'creditRating', com: FormControl },
        { label: '征信编号', field: 'creditCode', com: FormControl },
        { label: '征信生成时间', field: 'creditGenerateTime', com: DatePicker,format: 'YYYY-MM-DD HH:mm:ss'},
    ]

    mainForm3 = [
        { label: '联系人姓名', field: 'linkmanName', com: FormControl ,required: true },
        { label: '联系人联系方式', field: 'linkmanContact', com: FormControl ,required: true },
        { label: '联系人与承租人关系', field: 'linkmanLesseeRelationship', com:Select ,required: true, data: [{ key: '直系亲属', value: '0' }, { key: '朋友', value: '1' }, { key: '同事', value: '2' }, { key: '其他', value: '3' }] } ,
        { label: '联系人居住地址', field: 'linkmanAddress', com: FormControl,required: true  },
    ]

    mainForm4 = [
        { label: '配偶姓名', field: 'spouseName', com: FormControl  },
        { label: '配偶证件类型', field: 'spouseIdentityType',  com: Select ,data: [{ key: '身份证', value: '0' }, { key: '执照(SI)', value: '1' },{ key: '驾照', value: '2' },{ key: '护照', value: '3' },{ key: '其他', value: '4' }] },
        { label: '配偶证件号码', field: 'spouseIdentityNo', com:FormControl } ,
        { label: '配偶年龄', field: 'spouseAge', com: FormInputNumber },
        { label: '配偶联系方式', field: 'spouseContact', com: FormControl},
        { label: '配偶文化程度', field: 'spouseLevelEducation',com: Select,data: [{ key: '研究生', value: '0' }, { key: '本科', value: '1' }, { key: '专科', value: '2' }, { key: '中专', value: '3' }, { key: '高中', value: '4' }, { key: '初中', value: '5' }, { key: '小学', value: '6' }, { key: '未知', value: '7' }]},
        { label: '配偶工作单位名称', field: 'spouseEmployerName', com: FormControl },
        { label: '配偶单位电话', field: 'spouseEmployerPhone', com: FormControl },
        { label: '配偶单位地址', field: 'spouseEmployerAddress', com: FormControl },
        { label: '配偶单位性质', field: 'spouseEmployerNature', com: FormControl  },
    ]

    mainForm5 = [
        { label: '担保人姓名', field: 'guarantorName', com: FormControl },
        { label: '担保人证件类型', field: 'guarantorIdentityType', com: Select ,data: [{ key: '身份证', value: '0' }, { key: '执照(SI)', value: '1' },{ key: '驾照', value: '2' },{ key: '护照', value: '3' },{ key: '其他', value: '4' }] },
        { label: '担保人证件号', field: 'guarantorIdentityNo', com:FormControl } ,
        { label: '担保人出生日期', field: 'guarantorBirthday', com: DatePicker, format: 'YYYY-MM-DD'},
        { label: '担保人性别', field: 'guarantorSex', com: Select, data: [{ key: '男', value: '0' }, { key: '女', value: '1' }] },
        { label: '担保人年龄', field: 'guarantorAge', com: FormInputNumber },
        { label: '担保人联系方式', field: 'guarantorContact', com: FormControl },
        { label: '担保人与承租人关系', field: 'guarantorLesseeRelationship', com: Select, data: [{ key: '直系亲属', value: '0' }, { key: '朋友', value: '1' }, { key: '同事', value: '2' }, { key: '其他', value: '3' }]  },
        { label: '担保人年收入', field: 'guarantorAnnualIncome', com: FormInputNumber,toThousands: true, precision: 2  },
        { label: '担保人婚姻状况', field: 'guarantorMarryStatus', com: Select , data: [{ key: '已婚', value: '0' }, { key: '未婚', value: '1' },{ key: '离异', value: '2' },{ key: '丧偶', value: '3' }] },
        { label: '担保人居住地址', field: 'guarantorAddress', com: FormControl },
        { label: '担保人单位名称', field: 'guarantorEmployerName', com: FormControl },
        { label: '担保人单位地址', field: 'guarantorEmployerAddress', com: FormControl  },
        { label: '担保人单位电话', field: 'guarantorEmployerPhone', com: FormControl},
        { label: '担保人担保能力说明', field: 'guarantorDescribe', com: FormControl },
    ]

    mainForm6 = [
        { label: '持卡人姓名', field: 'cardholderName', com: FormControl ,required: true },
        { label: '卡号', field: 'cardNo', com: FormControl ,required: true },
        { label: '开户银行', field: 'bank', com:FormControl ,required: true } ,
        { label: '开户行号', field: 'bankNo', com: FormControl,required: true  },
        { label: '手机号', field: 'iphoneNo', com: FormControl,required: true  },
    ]


    /**
     *表格列属性定义 title:属性中文名  key:字段名称  type:封装在service.js中的枚举类型 具体类型控制见js
     */
    gridOnSon = [
        {title:'计划投放日期',key:'plan_date_loan',type:'0'},
        {title:'投放金额(元)',key:'plan_cash_loan',type:'0'},
        {title:'不含税投放金额(元)',key:'plan_cash_corpus',type:'0'},
        {title:'税率',key:'tax_rate',type:'0'},
        {title:'税额(元)',key:'tax_cash',type:'0'},
        {title:'投放付款方式',key:'pay_method_loan',type:'0'},
        {title:'银票开票日期',key:'make_date_draft',type:'0'},
        {title:'银票到期日期',key:'end_date_loan',type:'0'},
        {title:'银票保证金比例',key:'deposit_ratio4draft',type:'0'},
        {title:'银票保证金利率',key:'interrate_ratio4draft',type:'0'},
        {title:'计息金额计算方式',key:'calinter_amount_style',type:'0'},
    ]
    // 子表列属性定义=>通过前端service工具类自动生成
    gridColumnOnSon = [];

    setHover = (flag) =>{
        this.setState({isHover: flag});
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const {positionIndex, scrollFlag} = this.props;
        let _formObject = this.props.formObject;
        let formObject = deepClone(_formObject);
        let _props = this.props;
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
                                   disabled={value.disabled ? value.disabled : !this.props.isEdit}
                                   data={value.data ? value.data : ''}
                                   refurl={value.refurl}
                                   toThousands={value.com === FormInputNumber ? (value.toThousands ? value.toThousands : true) : ''}  //是否显示千分位
                                   precision={value.com === FormInputNumber ? (value.precision ? value.precision : 2) : ''} //保留2位小数
                                   componentClass={value.class ? value.class : 'input'}
                                   {
                                       ...getFieldProps(value.field, {
                                           initialValue:value.field&&value.field.indexOf(".")>0 ? formObject[value.field.substring(0,value.field.indexOf("."))][value.field.substr(value.field.indexOf(".")+1)]: formObject[value.field],
                                           normalize:(value)=>{
                                            if(value&&value.format){
                                                return value.format(value.format)
                                            }else{
                                                return value
                                            }
                                        },
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
                        <div className = 'jic-form-content'>
                        <PositionScroll scrollFlag={scrollFlag} positionIndex={positionIndex} scrollData={this.state.scrollData} open={true} callBack={this.childPosition} modelName="customer" />
                        <Panel header={this.state.open ? <div id="open"><Icon type="uf-reduce-c-o">客户基本信息</Icon></div>:<div id="open"><Icon type="uf-add-c-o">客户基本信息</Icon></div>} eventKey="1" collapsible defaultExpanded="true" expanded={this.state.open} onSelect={this.handleSelect.bind(this,'1')} >
                            <Form>
                                {loop(this.mainForm1)}
                            </Form>
                        </Panel>


                        <Panel header={this.state.open2 ? <div id="open2"><Icon type="uf-reduce-c-o">征信信息</Icon></div>:<div id="open2"><Icon type="uf-add-c-o">征信信息</Icon></div>} eventKey="2" collapsible defaultExpanded="true" expanded={this.state.open2} onSelect={this.handleSelect.bind(this,'2')} >
                            <Form>
                                    {loop(this.mainForm2)}
                            </Form>
                            </Panel>

                        <Panel header={this.state.open3 ? <div id="open3"><Icon type="uf-reduce-c-o">紧急联系人</Icon></div>:<div id="open3"><Icon type="uf-add-c-o">紧急联系人</Icon></div>} eventKey="3" collapsible defaultExpanded="true" expanded={this.state.open3} onSelect={this.handleSelect.bind(this,'3')} >

                            <Form>
                                {loop(this.mainForm3)}
                            </Form>
                            </Panel>

                        <Panel header={this.state.open4 ? <div id="open4"><Icon type="uf-reduce-c-o">配偶信息</Icon></div>:<div id="open4"><Icon type="uf-add-c-o">配偶信息</Icon></div>} eventKey="4" collapsible defaultExpanded="true" expanded={this.state.open4} onSelect={this.handleSelect.bind(this,'4')} >

                            <Form>
                                {loop(this.mainForm4)}
                            </Form>
                            </Panel>

                        <Panel header={this.state.open5 ? <div id="open5"><Icon type="uf-reduce-c-o">担保人信息</Icon></div>:<div id="open5"><Icon type="uf-add-c-o">担保人信息</Icon></div>} eventKey="5" collapsible defaultExpanded="true" expanded={this.state.open5} onSelect={this.handleSelect.bind(this,'5')} >
                            <Form>
                                {loop(this.mainForm5)}
                            </Form>
                            </Panel>

                        <Panel header={this.state.open6 ? <div id="open6"><Icon type="uf-reduce-c-o">银行卡信息</Icon></div>:<div id="open6"><Icon type="uf-add-c-o">银行卡信息</Icon></div>} eventKey="6" collapsible defaultExpanded="true" expanded={this.state.open6} onSelect={this.handleSelect.bind(this,'6')} >

                            <Form>
                                {loop(this.mainForm6)}
                            </Form>
                            </Panel>
                        </div>
                    </div>



                    <div className="childListView">
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
                            <TabPane tab='子表信息' key="1"> 
                           <div>
                                <GridMain
                                    ref={(el) => this.gridOnTheLoan = el} //存模版
                                    columns={this.gridColumnOnSon} //字段定义
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