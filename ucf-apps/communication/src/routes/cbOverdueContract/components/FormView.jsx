import React, { Component } from 'react';
import {actions} from "mirrorx";
import { Form, Icon, Button, Label, Select, Col, FormControl, Collapse, Tabs, ButtonGroup,Panel } from 'tinper-bee';
import { deepClone } from "utils";
import DatePicker from "tinper-bee/lib/Datepicker";
import FormInputNumber from 'components/FormRef/FormInputNumber';
import TableFormRef from 'components/FormRef/TableFormRef';
import TableTreeRef from 'components/FormRef/TableTreeRef';
import {genGridColumn} from "utils/service";
import GridMain from 'components/GridMain';
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
        };
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //渲染前首先使用工具加载表格的列标题
        //this.gridColumnOnTheLoan = [...genGridColumn(this.gridOnTheLoan)];
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

    //子表添加数据
    add = () => {
        if(this.state.activeKey == '1'){
            actions.communicationCbOverdueContract.updateState({planformObj:{},ifplanAdd:true,showLoanModal:true})
        }
    }
    //子表更新数据 更新删除数据时 一定要进行深克隆后对克隆数据进行处理 然后更新原数据 否则很容易报错!
    onEdit = () => {
        if(this.state.activeKey == '1'){
            singleRecordOper(this.props.selectedPlanList,(param) => {
                let _planformObj = deepClone(this.props.selectedPlanList[0]);
                actions.communicationCbOverdueContract.updateState({planformObj:_planformObj,showLoanModal:true});
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
            actions.communicationCbOverdueContract.updateState({ list2 : newlist,selectedPlanList:[] });  
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
            actions.communicationCbOverdueContract.updateState({ list2 : _list2,selectedPlanList : _selectedPlanList});
        }
    }

    getValue = (formObject,value) =>{
        if(value.indexOf('.')>0){
            let field = value.substr(value.indexOf('.')+1);
            value = value.substring(0,value.indexOf("."));
            formObject = formObject[value];
            return this.getValue(formObject,field);
        }
        return formObject[value];
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
        { label: '交易批次号', field: 'paymentBatchNo', com: FormControl, required: true },
        { label: '合同编号', field: 'contCode', com: FormControl, required: true },
        { label: '合同名称', field: 'contName', com: FormControl, required: true },
        { label: '客户名称', field: 'customerName', com: FormControl, required: true},
        { label: '单位名称', field: 'employerName', com: FormControl, required: true},
        { label: '起租日期', field: 'leaseDate', com: FormControl, required: true },
        { label: '期次', field: 'periodTime', com: FormControl, required: true },
        { label: '应收日期', field: 'receivableDate', com: FormControl, required: true},
        { label: '应收金额', field: 'receivableAmount', com: FormInputNumber, required: true, toThousands: true, precision: 2  },
        { label: '逾期状态', field: 'overdueState', com: FormControl, required: true },
        { label: '币种', field: 'pkCurrtype', com: FormControl, required: true },
        { label: '公司主体', field: 'companyBody', com: FormControl, required: true},
        { label: '来源系统', field: 'pkSystem', com: FormControl, required: true},
    ]




    render() {
        const { getFieldProps, getFieldError } = this.props.form;
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
                        <div className = 'jic-form-content'>
                        <Panel header={this.state.open ? <Icon type="uf-reduce-c-o">逾期合同信息</Icon>:<Icon type="uf-add-c-o">逾期合同信息</Icon>} eventKey="1" collapsible defaultExpanded="true" expanded={this.state.open} onSelect={this.handleSelect.bind(this,'1')} >
                            <Form>
                                {loop(this.mainForm1)}
                            </Form>
                        </Panel>

                        </div>
                    </div>
                </div>
            );

        } else {
            return <div></div>
        }

    }
}

export default Form.createForm()(FormView);