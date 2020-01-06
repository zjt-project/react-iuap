import React, { Component } from 'react';
import {Modal,Message ,Form, Icon, Button, Label, Col, FormControl } from 'tinper-bee';
import {deepClone} from "utils";
import {actions} from 'mirrorx';
import FormInputNumber from 'components/FormRef/FormInputNumber';
import './index.less';

const FormItem = Form.FormItem;
class LoanModalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
    }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
    }

    mainForm1 = [
        { label: '计划投放日期', field: 'plan_date_loan', com: FormControl, required: true },
        { label: '投放金额(元)', field: 'plan_cash_loan', com: FormControl, required: true },
        { label: '不含税投放金额(元)', field: 'plan_cash_corpus', com: FormControl, required: true},
        { label: '税率', field: 'tax_rate', com: FormControl, required: true},
        { label: '税额(元)', field: 'tax_cash', com: FormControl, required: true},
        { label: '投放付款方式', field: 'pay_method_loan', com: FormControl, required: true },
        { label: '银票开票日期', field: 'make_date_draft', com: FormControl, required: true},
        { label: '银票到期日期', field: 'end_date_loan', com: FormControl, required: true},
        { label: '银票保证金比例', field: 'deposit_ratio4draft', com: FormControl, required: true },
        { label: '银票保证金利率', field: 'interrate_ratio4draft', com: FormControl, required: true },
        { label: '计息金额计算方式', field: 'calinter_amount_style', com: FormControl, required: true },
    ]

    alertDone = ()=>{
      Message.create({content: '操作成功', color: 'successlight'});
      let obj = this.props.form.getFieldsValue();
      if(this.props.TabKey == '1'){
        let _list2 = deepClone(this.props.list2);
        if(this.props.ifplanAdd==true){
            _list2.push(
                obj
            );
        }else{
                _list2.map(item => {
                if(item.pk==this.props.selectedPlanList[0]['pk']){
                    Object.assign(item,obj);
                }
            });
        }
        actions.communicationCbOverdueContract.updateState({list2:_list2,ifplanAdd:false});
      }
      
      actions.communicationCbOverdueContract.updateState({showLoanModal : false});
    }


    close= () =>{
      actions.communicationCbOverdueContract.updateState({showLoanModal : false});
    }


    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let formObject = this.props.planformObj;
        let _props = this.props;
        const loop = data => data.map((value, key) => {
            return (
                <Col md={value.col ? value.col : 6} xs={value.col ? value.col : 6} sm={value.col ? value.col : 6}>
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
                                   toThousands={value.com == FormInputNumber ? (value.toThousands ? value.toThousands : true) : ''}  //是否显示千分位
                                   precision={value.com == FormInputNumber ? (value.precision ? value.precision : 2) : ''} //保留2位小数
                                   componentClass={value.class ? value.class : 'input'}
                                   {
                                       ...getFieldProps(value.field, {
                                           initialValue:value.field&&value.field.indexOf(".")>0 ? formObject[value.field.substring(0,value.field.indexOf("."))][value.field.substr(value.field.indexOf(".")+1)]: formObject[value.field],
                                           rules: [{
                                               required: true,
                                           }],
                                       })
                                   }>
                        </value.com>
                    </FormItem>
                </Col>)
        });
        let pageinfo;
        if(this.props.TabKey == '1'){
            pageinfo = loop(this.mainForm1);
        }
        return (
                <Modal
                    show={this.props.showLoanModal}
                    onHide={this.close}
                    size="lg"
                    backdrop="static"
                    centered="true"
                    dialogClassName="plan_modal_form"
                    > 
                    <div className="modal_header">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                投放计划信息
                            </Modal.Title>
                        </Modal.Header>
                    </div>

                    <Modal.Body>
                            <div className="steps-contents">
                            <Form>
                                {pageinfo}
                            </Form>
                            </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <div>
                        <Button bordered style={{ marginRight: 8 }} colors="primary" onClick={this.alertDone}>保存</Button>
                        <Button bordered colors="secondary" onClick={this.close}>取消</Button>
                    </div>
                    </Modal.Footer>
                </Modal> 
        );
    }
}

export default Form.createForm()(LoanModalView);