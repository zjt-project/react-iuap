import React, { Component } from 'react';
import {Modal,Message ,Form, Icon, Button, Label, Col, FormControl } from 'tinper-bee';
import {deepClone} from "utils";
import {actions} from 'mirrorx';
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
        { label: '付款交易批次号', field: 'paymentBatchNo', com: FormControl, required: true },
        { label: '合同编号', field: 'contCode', com: FormControl, required: true },
        { label: '合同名称', field: 'contName', com: FormControl, required: true},
        { label: '客户名称', field: 'customerName', com: FormControl, required: true},
        { label: '单位名称', field: 'employerName', com: FormControl, required: true},
        { label: '合同金额', field: 'contAmount', com: FormControl, required: true },
        { label: '租赁方式', field: 'leaseType', com: FormControl, required: true},
        { label: '实际放款金额（明细）', field: 'actualLoanAmount', com: FormControl, required: true},
        { label: '来源系统', field: 'pkSys', com: FormControl, required: true }
    ];

    alertDone = ()=>{
        Message.create({content: '操作成功', color: 'successlight'});
        let obj = this.props.form.getFieldsValue();
        let _list2 = deepClone(this.props.list2);
        if(this.props.ifplanAdd==true){
            const currentIndex  = _list2.length;
            _list2.push({
                index: currentIndex,
                pk:currentIndex+1,
                plan_date_loan:obj.plan_date_loan,
                plan_cash_loan:obj.plan_cash_loan,
                plan_cash_corpus:obj.plan_cash_corpus,
                tax_rate:obj.tax_rate,
                tax_cash:obj.tax_cash,
                pay_method_loan:obj.pay_method_loan,
                make_date_draft:obj.make_date_draft,
                end_date_loan:obj.end_date_loan,
                deposit_ratio4draft:obj.deposit_ratio4draft,
                interrate_ratio4draft:obj.interrate_ratio4draft,
                calinter_amount_style:obj.calinter_amount_style,
            });
        }else{
            _list2.map(item => {
                if(item.pk==this.props.selectedPlanList[0]['pk']){
                    Object.assign(item,obj);
                }
            });
        }
        actions.communicationCapital.updateState({showLoanModal : false,list2:_list2,ifplanAdd:false});
    };


    close= () =>{
        actions.communicationCapital.updateState({showLoanModal : false});
    };


    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let planformObj = this.props.planformObj;
        let _props = this.props;
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
                            付款信息子表
                        </Modal.Title>
                    </Modal.Header>
                </div>

                <Modal.Body>
                    <div className="steps-contents">
                        <Form>
                            <div>
                                {
                                    this.mainForm1.map((value, key) => {
                                        return (
                                            <Col md={6} xs={6} sm={6}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        {value.label}
                                                    </Label>
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
                                                               {
                                                                   ...getFieldProps(value.field, {
                                                                       initialValue: planformObj[value.field],
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
                            </div>
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
