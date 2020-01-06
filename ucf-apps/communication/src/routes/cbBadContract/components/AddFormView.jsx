/**
*
* @title 结合切换事件的 Step组件完成主页面模态框形式新增数据
* @description 点击next，Step的流程跟进
*
*/
import React, { Component } from 'react';
import { Step, Button, Message, Modal, Form, Icon, Label, Col, Row, Select, FormControl, Tabs } from 'tinper-bee';
import { actions } from 'mirrorx';
import TableFormRef from 'components/FormRef/TableFormRef';
import { deepClone } from "utils";
import DatePicker from "tinper-bee/lib/Datepicker";
import FormInputNumber from 'components/FormRef/FormInputNumber';
import { enumConstant } from '../../../../../../ucf-common/src/utils/enums';
import './index.less';

const Steps = Step.Steps;         //步骤条组件使用定义 如不定义则只能使用Step.Steps 此处定义全局变量是为了方便使用
const FormItem = Form.FormItem;   //表单组件使用定义   与上述情况相同 
const addTitle = "快速报价";       //模态框标题
const steps = [                   //步骤条每步使用标题  对应嵌套模态框内部标题
    { title: '投放信息' },
    { title: '留购价款及保证金设置' },
    { title: '手续费及中间费用支出设置' },
    { title: '收租设置' },
    { title: '租息率设置' },
    { title: 'IRR信息' },
];

class AddFormView extends Component {
    constructor(props) {

        super(props);
        this.state = {
            current: 0,        //初始模态框进入页签参数  
            showDiv1: '',      //控制模态框内部每个页签的显示隐藏 为''时显示 为none时隐藏
            showDiv2: 'none',
            showDiv3: 'none',
            showDiv4: 'none',
            showDiv5: 'none',
            showDiv6: 'none',
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

    //将新增数据存入缓存 避免因为异常情况关闭页面重新输入数据
    saveCache = () => {
        let objectForm = this.props.form.getFieldsValue();
        localStorage.setItem("addKey", JSON.stringify(objectForm));  //以JSON ：key-value形式置入缓存
    }

    //模态框下一步操作
    next = () => {
        const current = this.state.current + 1;
        this.setState({ current });
        this.nextController();
        this.saveCache();
    }

    //模态框上一步操作
    prev = () => {
        const current = this.state.current - 1;
        this.setState({ current });
        this.prevController();
    }

    //控制下一步 显示那个div
    nextController = () => {
        let key = 'showDiv';
        let num = this.state.current + 2;
        let showDiv = key + num;
        let noneDiv = key + (num - 1);
        let map = {};
        map[showDiv] = '';
        map[noneDiv] = 'none';
        this.setState(map)
    }

    //控制上一步 显示那个div
    prevController = () => {
        let key = 'showDiv';
        let num = this.state.current;
        let showDiv = key + num;
        let noneDiv = key + (num + 1);
        let map = {};
        map[showDiv] = '';
        map[noneDiv] = 'none';
        this.setState(map)
    }

    //关闭模态框后重置初始化数据
    initDiv = () => {
        this.setState({
            current: 0,
            showDiv1: '',
            showDiv2: 'none',
            showDiv3: 'none',
            showDiv4: 'none',
            showDiv5: 'none',
            showDiv6: 'none',
        });
    }
    //点击保存存储对应新增数据 移除缓存 并重置模态框
    alertDone = () => {
        Message.create({ content: '完成', color: 'successlight' });
        localStorage.removeItem("addKey");
        this.initDiv();
        this.close();
    }
    //关闭模态框
    close = () => {
        actions.communicationCbBadContract.updateState({ showModal: false });
        this.initDiv();
    }

    //onChange方法 保证金比例
    handleChangeDeposit_ratio = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = objectForm.total_amount_equipment * value;
        this.props.form.setFieldsValue({ 'deposit_cash': val });
    }

    //onChange方法 保证金金额
    handleChangeDeposit_cash = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = (objectForm.total_amount_equipment > 0 ? value / objectForm.total_amount_equipment : 0)
        this.props.form.setFieldsValue({ 'deposit_ratio': val });
    }
    //租金税率
    handleChangeRent_tax_rate = (value) => {
        this.props.form.setFieldsValue({ 'srvfee_taxrate_in': value });
    }
    //租赁方式
    handleChangeLease_method = (value) => {
        this.props.form.setFieldsValue({ 'if_corpus_tickets': value });
    }
    //onChange方法 手续费比例
    handleChangeSrvfee_ratio_in = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = objectForm.total_amount_equipment * value;
        this.props.form.setFieldsValue({ 'srvfee_cash_in_ft': val });
    }

    //onChange方法 首期手续费金额
    handleChangeSrvfee_cash_in_ft = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = (objectForm.total_amount_equipment > 0 ? value / objectForm.total_amount_equipment : 0)
        this.props.form.setFieldsValue({ 'srvfee_ratio_in': val });
    }

    render() {
        const { current } = this.state;
        const { getFieldProps } = this.props.form;
        let _formObject = this.props.formObject;
        let formObject = deepClone(_formObject);
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
                            <Steps current={current}>
                                {steps.map(item => <Step key={item.title} title={item.title} />)}
                            </Steps>

                            <div className="steps-content jic-form">
                                {/**
                                    表单内容组件Form 包含表单的内容放置在组件内部
                                    其中 Row Col 为处理格式的栅格布局 Row控制单行 Col 控制 md xs sm 即 中 大 小三种分辨率的列排序占比 单行12列
                                    FormItem为单个表单域 囊括 标签Label与输入框FormControl 其中输入框同样可以换为下拉框Select等组件
                                    FormControl的 getFieldProps为固定使用形式 内部填写当前单个表单域的属性名称 
                                                  initiaValue为表单初始默认值
                                                  rules表单常用校验规则 内部required 为必输属性控制
                                */}
                                <Form>
                                    <div style={{ display: this.state.showDiv1 }}>

                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        测算方案名称
                                      </Label>
                                                    <FormControl
                                                        {
                                                        ...getFieldProps('quot_name', {
                                                            initialValue: formObject.quot_name,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        限额方案
                                                    </Label>
                                                    <TableFormRef
                                                        {...this.props}
                                                        isEdit={true}
                                                        ref="tableRefAdd"
                                                        title={"限额方案"}
                                                        name={"pk_limit_plan"}
                                                        {
                                                        ...getFieldProps('pk_limit_plan', {
                                                            initialValue: formObject.pk_limit_plan,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>
                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        租赁方式
                                      </Label>

                                                    <Select
                                                        data={[{ key: '直租', value: '0' }, { key: '回租', value: '1' }]}
                                                        {...getFieldProps('lease_method', {
                                                            onChange: this.handleChangeLease_method,
                                                            initialValue: formObject.lease_method,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />


                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        本金是否开票
                                      </Label>
                                                    {/**
                                                        下拉框选取Select组件 disabled控制是否可编辑
                                                        下拉选取数据通过枚举项处理工具使用enumConstant解析加入字段
                                                                   也可通过自定义枚举数据以key-value形式定义 其中key为名称 value为值
                                                        可编辑时使用onChange事件作为编辑处理函数
                                                    */}
                                                    <Select disabled={true}
                                                        data={enumConstant('yesOrNo')}
                                                        {...getFieldProps('if_corpus_tickets', {
                                                            initialValue: formObject.if_corpus_tickets,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />


                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        租金税率
                                      </Label>

                                                    <Select
                                                        data={[{ key: '0%', value: '0' }, { key: '3%', value: '3' }, { key: '6%', value: '6' }, { key: '10%', value: '10' }]}

                                                        {...getFieldProps('rent_tax_rate', {
                                                            onChange: this.handleChangeRent_tax_rate,
                                                            initialValue: formObject.rent_tax_rate,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        税种
                                      </Label>
                                                    <Select
                                                        data={[{ key: '增值税', value: '0' }, { key: '营业税', value: '1' }, { key: '复合税', value: '2' }, { key: '无', value: '4' }]}
                                                        {...getFieldProps('pk_currtype', {
                                                            initialValue: formObject.pk_currtype,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        投放日期
                                      </Label>
                                                    {/**
                                                        日期组件DatePicker 除固有属性外 加入format处理格式类型
                                                    */}
                                                    <DatePicker
                                                        {
                                                        ...getFieldProps('plan_date_loan', {
                                                            initialValue: formObject.plan_date_loan,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                        format={'YYYY-MM-DD'}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        投放金额
                                      </Label>
                                                    {/**
                                                        金额数字组件FormInputNumber 除固有属性外
                                                        toThousands为true时金额类型会做千分位的转换
                                                        toPercent为true时控制显示百分号 即用作百分比数据使用
                                                        precision定义保留小数位的位数                                                        toPercent={true}  //是否显示百分号
                                                        min控制数字金额的最小值 max控制数字金额的最大值
                                                    */}
                                                    <FormInputNumber
                                                        disabled={false}
                                                        toThousands={true}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        {
                                                        ...getFieldProps('total_amount_equipment', {
                                                            initialValue: formObject.total_amount_equipment,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        租赁本金
                                      </Label>
                                                    <FormInputNumber
                                                        disabled={true}
                                                        toThousands={true}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        {
                                                        ...getFieldProps('fact_cash_loan', {
                                                            initialValue: formObject.fact_cash_loan,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>

                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        净融资比例
                                      </Label>
                                                    <FormInputNumber
                                                        disabled={true}
                                                        toPercent={true}  //是否显示百分号
                                                        precision={2} //保留2位小数
                                                        {
                                                        ...getFieldProps('project_manager', {
                                                            initialValue: formObject.project_manager,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>

                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>

                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        净融资额(元)
                                      </Label>
                                                    <FormInputNumber
                                                        disabled={true}
                                                        toThousands={true}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        {
                                                        ...getFieldProps('net_finance_cash', {
                                                            initialValue: formObject.net_finance_cash,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>

                                    </div>
                                    <div style={{ display: this.state.showDiv2 }}>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        留购价款(元)
                                      </Label>
                                                    <FormInputNumber
                                                        disabled={true}
                                                        toThousands={true}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        {
                                                        ...getFieldProps('nominal_price', {
                                                            initialValue: formObject.nominal_price,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        保证金比例
                                      </Label>
                                                    <FormInputNumber
                                                        disabled={false}
                                                        toPercent={true}  //是否显示百分号
                                                        precision={4}
                                                        {
                                                        ...getFieldProps('deposit_ratio', {
                                                            initialValue: formObject.deposit_ratio,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                            onChange: this.handleChangeDeposit_ratio,
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        保证金金额
                                      </Label>
                                                    <FormInputNumber
                                                        disabled={false}
                                                        toThousands={false}  //是否显示千分位
                                                        precision={2}
                                                        // min={0}
                                                        // max={999999}
                                                        {
                                                        ...getFieldProps('deposit_cash', {
                                                            initialValue: formObject.deposit_cash,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                            onChange: this.handleChangeDeposit_cash,
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>
                                        </Row>

                                    </div>
                                    <div style={{ display: this.state.showDiv3 }}>

                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        手续费收取方式
                                      </Label>
                                                    <Select
                                                        data={[{ key: '每满一年收取', value: '2' }, { key: '每年年初收取', value: '4' }, { key: '初期收取', value: '0' }]}
                                                        {...getFieldProps('srvfee_method_in', {
                                                            initialValue: formObject.srvfee_method_in,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        手续费比例
                                      </Label>
                                                    <FormInputNumber
                                                        toPercent={true}  //是否显示百分号
                                                        precision={4}
                                                        disabled={false}
                                                        {
                                                        ...getFieldProps('srvfee_ratio_in', {
                                                            initialValue: formObject.srvfee_ratio_in,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                            onChange: this.handleChangeSrvfee_ratio_in,
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        首期手续费金额(元)
                                      </Label>
                                                    <FormInputNumber
                                                        toThousands={false}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        disabled={false}
                                                        // min={0}
                                                        // max={999999}
                                                        {
                                                        ...getFieldProps('srvfee_cash_in_ft', {
                                                            initialValue: formObject.srvfee_cash_in_ft,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                            onChange: this.handleChangeSrvfee_cash_in_ft,
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        手续费总金额(元)
                                      </Label>
                                                    <FormInputNumber disabled={true}
                                                        toThousands={true}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        // min={0}
                                                        // max={999999}
                                                        {
                                                        ...getFieldProps('srvfee_cash_in', {
                                                            initialValue: formObject.srvfee_cash_in,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        手续费收入税率(增值税)
                                      </Label>
                                                    <Select disabled={true}
                                                        data={[{ key: '0%', value: '0' }, { key: '3%', value: '3' }, { key: '6%', value: '6' }, { key: '10%', value: '10' }]}
                                                        {...getFieldProps('srvfee_taxrate_in', {
                                                            initialValue: formObject.srvfee_taxrate_in,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        中间费用支出方式
                                      </Label>
                                                    <Select
                                                        //onChange={this.handleChange}
                                                        data={[{ key: '指定支付', value: '0' }, { key: '每满一年支付', value: '1' }, { key: '每年年初支付', value: '3' }]}
                                                        {...getFieldProps('lease_cal_method', {
                                                            initialValue: formObject.lease_cal_method,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        首期中间费用支出时间
                                      </Label>
                                                    <DatePicker
                                                        {
                                                        ...getFieldProps('srvfee_date_out_ft', {
                                                            initialValue: formObject.srvfee_date_out_ft,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                        format={'YYYY-MM-DD'}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        首期中间费用支出金额(元)
                                      </Label>
                                                    <FormInputNumber disabled={true}
                                                        toThousands={true}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        {
                                                        ...getFieldProps('srvfee_cash_out_ft', {
                                                            initialValue: formObject.srvfee_cash_out_ft,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        中间费用支出总金额(元)
                                      </Label>
                                                    <FormInputNumber disabled={true}
                                                        toThousands={true}  //是否显示千分位
                                                        precision={2} //保留2位小数
                                                        {
                                                        ...getFieldProps('srvfee_cash_out', {
                                                            initialValue: formObject.srvfee_cash_out,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        中间费用支出税率(增值税)
                                      </Label>

                                                    <Select
                                                        data={[{ key: '3%', value: '3' }, { key: '6%', value: '6' }, { key: '17%', value: '17' }
                                                            , { key: '0%', value: '0' }, { key: '11%', value: '11' }, { key: '16%', value: '16' }, { key: '10%', value: '10' }
                                                            , { key: '13%', value: '13' }, { key: '9%', value: '9' }
                                                        ]}
                                                        {...getFieldProps('srvfee_taxrate_out', {
                                                            initialValue: formObject.srvfee_taxrate_out,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>


                                        </Row>

                                    </div>
                                    <div style={{ display: this.state.showDiv4 }}>

                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        租赁期限(月)
                                     </Label>
                                                    <FormControl
                                                        {
                                                        ...getFieldProps('lease_times', {
                                                            initialValue: formObject.lease_times,

                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />


                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        先付后付标志
                                     </Label>
                                                    <Select
                                                        data={[{ key: '先付', value: '0' }, { key: '后付', value: '1' }]}
                                                        {...getFieldProps('prepay_or_not', {
                                                            initialValue: formObject.prepay_or_not,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        支付频率
                                     </Label>

                                                    <Select
                                                        data={[{ key: '月', value: '0' }, { key: '双月', value: '1' }, { key: '季', value: '2' }
                                                            , { key: '四月', value: '3' }, { key: '半年', value: '4' }, { key: '年', value: '5' }]}
                                                        {...getFieldProps('lease_freq', {
                                                            initialValue: formObject.lease_freq,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        计算方式
                                     </Label>
                                                    <Select
                                                        data={[{ key: '等额租金', value: '0' }, { key: '等额本金', value: '1' }, { key: '平息法', value: '2' }]}
                                                        {...getFieldProps('lease_cal_method', {
                                                            initialValue: formObject.lease_cal_method,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        总投放金额的计息方式
                                     </Label>
                                                    <Select
                                                        data={[{ key: '约定计息(第一笔投放)', value: '0' }, { key: '按投放时间点计息', value: '1' }]}
                                                        {...getFieldProps('interest_method_total_loan', {
                                                            initialValue: formObject.interest_method_total_loan,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        现金流日期计算方式
                                     </Label>
                                                    <Select
                                                        data={[{ key: '360', value: '0' }, { key: '365', value: '1' }]}
                                                        {...getFieldProps('year_days_flow', {
                                                            initialValue: formObject.year_days_flow,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>

                                    </div>

                                    <div style={{ display: this.state.showDiv5 }}>

                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        报价利率
                                      </Label>
                                                    <FormInputNumber
                                                        toPercent={true}
                                                        precision={6}
                                                        {
                                                        ...getFieldProps('final_rate', {
                                                            initialValue: formObject.final_rate,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        基准利率
                                      </Label>
                                                    <FormInputNumber
                                                        precision={6}
                                                        toPercent={true}
                                                        // min={0}
                                                        // max={999999}
                                                        {
                                                        ...getFieldProps('interrate', {
                                                            initialValue: formObject.interrate,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        计算精度
                                      </Label>
                                                    <Select
                                                        data={[{ key: '分', value: '0' }, { key: '元', value: '1' }]}
                                                        {...getFieldProps('cal_digit', {
                                                            initialValue: formObject.cal_digit,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        年化天数
                                     </Label>
                                                    <Select
                                                        data={[{ key: '360', value: '0' }, { key: '365', value: '1' }]}
                                                        {...getFieldProps('year_days', {
                                                            initialValue: formObject.year_days,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        利率类型
                                     </Label>
                                                    <Select
                                                        data={[{ key: '浮动', value: '0' }, { key: '固定', value: '1' }]}
                                                        {...getFieldProps('interrate_type', {
                                                            initialValue: formObject.interrate_type,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        币种
                                     </Label>
                                                    <Select
                                                        data={[{ key: '人民币', value: '0' }, { key: '多币种', value: '1' }, { key: '欧元', value: '1' }
                                                            , { key: '港元', value: '1' }, { key: '日元', value: '1' }, { key: '澳门元', value: '1' }, { key: '美元', value: '1' }]}
                                                        {...getFieldProps('pk_currtype', {
                                                            initialValue: formObject.pk_currtype,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        利率浮动方式
                                     </Label>

                                                    <Select
                                                        data={[{ key: '百分比', value: '0' }, { key: '绝对值', value: '1' }]}
                                                        {...getFieldProps('float_method', {
                                                            initialValue: formObject.float_method,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        利率生效日期
                                                </Label>

                                                    <TableFormRef
                                                        {...this.props}
                                                        isEdit={true}
                                                        ref="pk_interrate"
                                                        title={"限额方案"}
                                                        name={"pk_interrate"}
                                                        {
                                                        ...getFieldProps('pk_interrate', {
                                                            initialValue: formObject.pk_interrate,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        利率档次
                                     </Label>

                                                    <Select disabled={true}
                                                        data={[{ key: '六个月以内(含六个月)', value: '0' }, { key: '6个月至一年(含一年)', value: '1' }, { key: '一年至三年(含三年)', value: '2' }
                                                            , { key: '三年至五年(含三年)', value: '3' }, { key: '五年以上', value: '4' }]}
                                                        {...getFieldProps('interrate_level', {
                                                            initialValue: formObject.interrate_level,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        利率浮动值(%)
                                      </Label>
                                                    <FormInputNumber
                                                        toPercent={true}  //是否显示千分位
                                                        precision={6}  //是否显示千分位
                                                        //format = {this.formatDepositRatio.bind(this)}
                                                        // min={0}
                                                        // max={999999}
                                                        {
                                                        ...getFieldProps('float_value', {
                                                            initialValue: formObject.float_value,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>

                                        </Row>

                                    </div>



                                    <div style={{ display: this.state.showDiv6 }}>

                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        会计IRR按最新算法
                                      </Label>

                                                    <Select disabled={true}
                                                        data={enumConstant('yesOrNo')}
                                                        {...getFieldProps('finace_irr_method', {
                                                            initialValue: formObject.finace_irr_method,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        会计IRR算法启用年份
                                      </Label>
                                                    <Select disabled={true}
                                                        data={[{ key: '2015', value: '0' }, { key: '2016', value: '1' }]}
                                                        {...getFieldProps('finace_irr_year', {
                                                            initialValue: formObject.finace_irr_year,
                                                            rules: [{
                                                                required: true, message: '请选择',
                                                            }],
                                                        })}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        市场IRR
                                      </Label>
                                                    <FormControl disabled={true}
                                                        {
                                                        ...getFieldProps('project_irr', {
                                                            initialValue: formObject.project_irr,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        市场去税IRR
                                      </Label>
                                                    <FormControl disabled={true}
                                                        {
                                                        ...getFieldProps('project_notax_irr', {
                                                            initialValue: formObject.project_notax_irr,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />

                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        会计IRR
                                      </Label>
                                                    <FormControl disabled={true}
                                                        {
                                                        ...getFieldProps('finance_irr', {
                                                            initialValue: formObject.finance_irr,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={4} xs={4} sm={4}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        会计去税IRR
                                      </Label>
                                                    <FormControl disabled={true}
                                                        {
                                                        ...getFieldProps('finance_notax_irr', {
                                                            initialValue: formObject.finance_notax_irr,
                                                            rules: [{
                                                                required: true,
                                                            }],
                                                        })
                                                        }
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                    </div>
                                </Form>

                            </div>
                            <div className="steps-action">
                                {/**
                                    react的条件渲染支持以下形式处理 但必须使用{}包含
                                */}
                                {
                                    this.state.current > 0
                                    &&
                                    <Button bordered style={{ marginRight: 8 }} onClick={() => this.prev()}>上一步</Button>
                                }
                                {
                                    this.state.current < steps.length - 1
                                    &&
                                    <Button colors="primary" style={{ marginRight: 8 }} onClick={() => this.next()}>下一步</Button>
                                }
                                {
                                    this.state.current === steps.length - 1
                                    &&
                                    <Button colors="primary" style={{ marginRight: 8 }} onClick={() => this.alertDone()}>完成</Button>
                                }{
                                    <Button colors="secondary" onClick={() => this.close()}> 关闭 </Button>
                                }
                            </div>

                        </Modal.Body>
                    </Modal>
                </div>
            );
        }
    }
}
export default Form.createForm()(AddFormView);