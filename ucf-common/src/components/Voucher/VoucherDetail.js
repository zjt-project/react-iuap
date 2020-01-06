import React, {Component} from "react";
import {Button, Icon , Table, Form, Row, Col, FormControl,Label, InputNumber  } from 'tinper-bee';
import { genGridColumn } from "utils/service";
import {deepClone} from "utils";
import './index.less';
import Grid from "bee-complex-grid";

// Table无数据时的展示内容置空 不再显示无内容
const emptyFunc = () => '';

const FormItem = Form.FormItem;

class VoucherDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailObj:{},
            selectedRowIndex:-1,
        }
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        this.gridColumn = [...genGridColumn(this.detailGrid)];
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
    }

    //凭证子表  列属性定义
    detailGrid = [
        { title: '分录号', key: 'detailNo', type: '1', width:70, sorter:0},
        { title: '摘要', key: 'memo', type: '0', sorter:0 },
        { title: '科目', key: 'dispname', type: '0' , sorter:0},
        { title: '辅助核算', key: 'assist', type: '0' , sorter:0},
        { title: '币种', key: 'pkCurrtype.name', type: '0', width:70 , sorter:0},
        { title: '原币', key: 'factCash', type: '7', digit: 2 , width:70},
        { title: '借方', key: 'lend', type: '7', digit: 2 , width:70},
        { title: '贷方', key: 'loan', type: '7', digit: 2 , width:70 },
        { title: '备注', key: 'aa', type: '0', width:70 , sorter:0},
    ];


    /**
     * 点击row选择框触发绑定数据对象
     */
    getSelectedDataFunc = (record,index) => {
        if(record!=undefined&&index!=undefined){
            let formObj = deepClone(record);
            this.setState({detailObj:formObj,selectedRowIndex:index});
        }
    }

    
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let {voucherObj,detailList} = this.props;
        let {detailObj} = this.state;
        let _voucherObj = deepClone(voucherObj);
        if(_voucherObj == undefined || _voucherObj == null || Object.keys(_voucherObj) == 0){
            return <div></div>
        }
        return (
            <div className = "voucher_detail">
                <div className = "voucher_detail_top">
                    <Form>
                        <Row>
                            <Col md={12} xs={12} sm={12}>
                            <FormItem>
                                <Label>
                                    主体账簿:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('glorgbookname', {
                                        initialValue: _voucherObj.glorg.glorgbookname,
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col> 
                        </Row>
                        <Row>
                            <Col md={3} xs={3} sm={3}>
                                <FormItem>
                                    <Label>
                                        制单日期:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('prepareddate', {
                                            initialValue: _voucherObj.prepareddate,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col> 
                            <Col md={3} xs={3} sm={3}>
                                <FormItem>
                                    <Label>
                                        凭证类别:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('voucherno', {
                                            initialValue: _voucherObj.voucherno,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col> 
                            <Col md={3} xs={3} sm={3}>
                                <FormItem>
                                    <Label>
                                        附单据数:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('datacount', {
                                            initialValue: detailList.length,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col> 
                            <Col md={3} xs={3} sm={3}>
                                <FormItem>
                                    <Label>
                                        分录:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('count', {
                                            initialValue: this.state.selectedRowIndex!=null? this.state.selectedRowIndex+1+'/'+detailList.length : '0/'+detailList.length,
                                        })
                                        }
                                    />                               
                                    </FormItem>
                            </Col> 
                        </Row>
                        <div style={{'position':'absolute','right':0,'top':0}}>
                            <Button className="button_return" bordered onClick={this.props.Return}><Icon type='uf-back' /></Button>
                        </div>   
                    </Form>
                </div>
                <div className = "voucher_detail_middle">
                    <Grid
                        ref="voucherdetail"             //存模版
                        rowKey={(r, i) => {return i}}   //生成行的key
                        columns={this.gridColumn}       //字段定义
                        multiSelect={{type:"radio"}}    //false 单选，默认多选 
                        selectedRowIndex={this.state.selectedRowIndex}  //单选选中索引数据
                        data={detailList}               //数据数组
                        height={25}                     //行高度
                        headerHeight={30}               //表头高度
                        bordered={true}                 //边框
                        headerDisplayInRow={true}       //表头换行用...来表示
                        bodyDisplayInRow={true}         //表体换行用...来表示
                        hideHeaderScroll={false}        //无数据时是否显示表头 
                        dragborder={true}               //表头可拖拽 
                        columnFilterAble={false}        //右上角列过滤
                        focusable={true}                //快捷键
                        //分页对象
                        paginationObj={{
                            verticalPosition: 'none'
                        }}
                        emptyText={emptyFunc}  //无数据显示函数
                        rowClassName={(record,index,indent)=>{
                            if (this.state.selectedRowIndex == index) {
                                return 'selected';
                            } else {
                                return '';
                            }
                        }}
                        getSelectedDataFunc={this.getSelectedDataFunc}
                    />
                </div>
                <div className = "voucher_detail_bottom">
                    <Form>
                        <Row>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    合计差额:
                                </Label>
                                <div className = "input_form">
                                <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    toThousands={true}
                                    precision={2}
                                    {
                                    ...getFieldProps('totalmargin', {
                                        initialValue: '',
                                    })
                                    }
                                />  
                                </div>
                            </FormItem>
                            </Col> 
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    借方合计:
                                </Label>
                                <div className = "input_form">
                                    <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        toThousands={true}
                                        precision={2}
                                        {
                                        ...getFieldProps('totaldebit', {
                                            initialValue: _voucherObj.totaldebit,
                                        })
                                        }
                                    />  
                                </div>
                            </FormItem>
                            </Col> 
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    贷方合计:
                                </Label>
                                <div className = "input_form">
                                <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    toThousands={true}
                                    precision={2}
                                    {
                                    ...getFieldProps('totalcredit', {
                                        initialValue: _voucherObj.totalcredit,
                                    })
                                    }
                                /> 
                                </div> 
                            </FormItem>
                            </Col> 
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    大写合计:
                                </Label>
                                <div className = "input_form">
                                <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    toThousands={true}
                                    precision={2}
                                    {
                                    ...getFieldProps('totalcredit', {
                                        initialValue: _voucherObj.totalcredit,
                                    })
                                    }
                                />  
                                </div>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Form style={{'background-color':'white'}}>
                        <Row>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    结算方式:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('checkstyle', {
                                        initialValue: detailObj.checkstyle != null ? detailObj.checkstyle :'',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    结算号:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('pkCheck', {
                                        initialValue: detailObj.pkCheck != null ? detailObj.pkCheck :'',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    结算日期:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('checkDate', {
                                        initialValue: detailObj.checkDate != null ? detailObj.checkDate :'',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    数量:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('creditquantity', {
                                        initialValue: detailObj.totalcredit!=null&&detailObj.totalcredit>0?detailObj.creditquantity != null ? detailObj.creditquantity :''
                                        :detailObj.debitquantity != null ? detailObj.debitquantity :'',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    单价:
                                </Label>
                                <div className = "input_form">
                                <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    toThousands={true}
                                    precision={2}
                                    {
                                    ...getFieldProps('price', {
                                        initialValue: detailObj.price != null ? detailObj.price : '',
                                    })
                                    }
                                />  
                                </div>
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    原币:
                                </Label>
                                <div className = "input_form">
                                <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    toThousands={true}
                                    precision={2}
                                    {
                                    ...getFieldProps('factCash', {
                                        initialValue: detailObj.factCash != null ? detailObj.factCash: '',
                                    })
                                    }
                                />  
                                </div>
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    折辅汇率:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('excrate1', {
                                        initialValue: detailObj.excrate1 != null ? detailObj.excrate1 : '',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    辅币:
                                </Label>
                                <div className = "input_form">
                                <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    toThousands={true}
                                    precision={2}
                                    {
                                    ...getFieldProps('fracdebitamount', {
                                        initialValue: detailObj.fracdebitamount != null ? detailObj.fracdebitamount : detailObj.fraccreditamount != null ? detailObj.fraccreditamount : '',
                                    })
                                    }
                                />  
                                </div>
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    折本汇率:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('excrate2', {
                                        initialValue: detailObj.excrate2 != null ? detailObj.excrate2 : '',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={3} xs={3} sm={3}>
                            <FormItem>
                                <Label>
                                    本币:
                                </Label>
                                <div className = "input_form">
                                <InputNumber style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                    disabled={true}
                                    toThousands={true}
                                    precision={2}
                                    {
                                    ...getFieldProps('localdebitamount', {
                                        initialValue: detailObj.localdebitamount != null ? detailObj.localdebitamount  : detailObj.localcreditamount!=null ?detailObj.localcreditamount: '',
                                    })
                                    }
                                />
                                </div>  
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} xs={12} sm={12}>
                            <FormItem>
                                <Label>
                                    辅助核算:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default','width':'80%'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('assist', {
                                        initialValue: detailObj.assist!=null ? detailObj.assist: '',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={12} xs={12} sm={12}>
                            <FormItem>
                                <Label>
                                    科目自由项:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default','width':'80%'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('subjfreevalue', {
                                        initialValue: detailObj.subjfreevalue != null ? detailObj.subjfreevalue  : '',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                            <Col md={12} xs={12} sm={12}>
                            <FormItem>
                                <Label>
                                    现金流量:
                                </Label>
                                <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default','width':'80%'}}
                                    disabled={true}
                                    {
                                    ...getFieldProps('cashflow', {
                                        initialValue: detailObj.cashflow != null ? detailObj.cashflow  : '',
                                    })
                                    }
                                />  
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div className = "voucher_detail_bottom_down">
                    <Form>
                        <Row>
                            <Col md={3} xs={3} sm={3}>
                                <FormItem>
                                    <Label>
                                        来源系统:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('systemname', {
                                            initialValue: _voucherObj.systemname,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col>
                            <Col md={2} xs={2} sm={2}>
                                <FormItem>
                                    <Label>
                                        记账:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('manager.userName', {
                                            initialValue: _voucherObj.manager.userName,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col>
                            <Col md={2} xs={2} sm={2}>
                                <FormItem>
                                    <Label>
                                        审核:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('checked.userName', {
                                            initialValue: _voucherObj.checked.userName,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col>
                            <Col md={2} xs={2} sm={2}>
                                <FormItem>
                                    <Label>
                                        签字:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('prepared.userName', {
                                            initialValue: _voucherObj.prepared.userName,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col>
                            <Col md={2} xs={2} sm={2}>
                                <FormItem>
                                    <Label>
                                        制单:
                                    </Label>
                                    <FormControl style = {{'background-color':'transparent','border':0,'cursor':'default'}}
                                        disabled={true}
                                        {
                                        ...getFieldProps('prepared.userName', {
                                            initialValue: _voucherObj.prepared.userName,
                                        })
                                        }
                                    />  
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default VoucherDetail;
