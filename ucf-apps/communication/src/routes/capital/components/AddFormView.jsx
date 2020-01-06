/**
 *
 * @title 结合切换事件的 Step组件完成主页面模态框形式新增数据
 * @description 点击next，Step的流程跟进
 *
 */
import React, {Component} from 'react';
import {Button, Col, Form, FormControl, Icon, Label, Message, Modal, Row, Select, Step, Tabs} from 'tinper-bee';
import {actions} from 'mirrorx';
import {deepClone} from "utils";
import DatePicker from "tinper-bee/lib/Datepicker";
import FormInputNumber from 'components/FormRef/FormInputNumber';
import './index.less';

const Steps = Step.Steps;         //步骤条组件使用定义 如不定义则只能使用Step.Steps 此处定义全局变量是为了方便使用
const FormItem = Form.FormItem;   //表单组件使用定义   与上述情况相同
const addTitle = "基本信息";       //模态框标题
const steps = [                   //步骤条每步使用标题  对应嵌套模态框内部标题
    { title: '基本信息' }
];

class AddFormView extends Component {
    constructor(props) {

        super(props);
        this.state = {
            current: 0,        //初始模态框进入页签参数
            showDiv1: '',      //控制模态框内部每个页签的显示隐藏 为''时显示 为none时隐藏
            // showDiv2: 'none',
            // showDiv3: 'none',
            // showDiv4: 'none',
            // showDiv5: 'none',
            // showDiv6: 'none',
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
            // showDiv2: 'none',
            // showDiv3: 'none',
            // showDiv4: 'none',
            // showDiv5: 'none',
            // showDiv6: 'none',
        });
    }
    //点击保存存储对应新增数据 移除缓存 并重置模态框
    alertDone = () => {
        Message.create({ content: '完成', color: 'successlight' });
        localStorage.removeItem("addKey");
        this.initDiv();
        this.close();
    };
    //关闭模态框
    close = () => {
        actions.communicationCapital.updateState({ showModal: false });
        this.initDiv();
    };

    //onChange方法 保证金比例
    handleChangeDeposit_ratio = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = objectForm.total_amount_equipment * value;
        this.props.form.setFieldsValue({ 'deposit_cash': val });
    };

    //onChange方法 保证金金额
    handleChangeDeposit_cash = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = (objectForm.total_amount_equipment > 0 ? value / objectForm.total_amount_equipment : 0)
        this.props.form.setFieldsValue({ 'deposit_ratio': val });
    };
    //租金税率
    handleChangeRent_tax_rate = (value) => {
        this.props.form.setFieldsValue({ 'srvfee_taxrate_in': value });
    };
    //租赁方式
    handleChangeLease_method = (value) => {
        this.props.form.setFieldsValue({ 'if_corpus_tickets': value });
    };
    //onChange方法 手续费比例
    handleChangeSrvfee_ratio_in = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = objectForm.total_amount_equipment * value;
        this.props.form.setFieldsValue({ 'srvfee_cash_in_ft': val });
    };

    //onChange方法 首期手续费金额
    handleChangeSrvfee_cash_in_ft = (value) => {
        let objectForm = this.props.form.getFieldsValue();
        let val = (objectForm.total_amount_equipment > 0 ? value / objectForm.total_amount_equipment : 0)
        this.props.form.setFieldsValue({ 'srvfee_ratio_in': val });
    };

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
                                                        合同编号
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('contCode', {
                                                                initialValue: formObject.contCode,
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
                                                        合同名称
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('contName', {
                                                                initialValue: formObject.contName,
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
                                                        客户名称
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('customerName', {
                                                                initialValue: formObject.customerName,
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
                                                        单位名称
                                                    </Label>
                                                    {/**
                                                     下拉框选取Select组件 disabled控制是否可编辑
                                                     下拉选取数据通过枚举项处理工具使用enumConstant解析加入字段
                                                     也可通过自定义枚举数据以key-value形式定义 其中key为名称 value为值
                                                     可编辑时使用onChange事件作为编辑处理函数
                                                     */}
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('employerName', {
                                                                initialValue: formObject.employerName,
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
                                                    {/**
                                                     金额数字组件FormInputNumber 除固有属性外
                                                     toThousands为true时金额类型会做千分位的转换
                                                     toPercent为true时控制显示百分号 即用作百分比数据使用
                                                     precision定义保留小数位的位数                                                        toPercent={true}  //是否显示百分号
                                                     min控制数字金额的最小值 max控制数字金额的最大值
                                                     */}
                                                    <Select
                                                        data={[{ key: '直租', value: '0' }, { key: '回租', value: '1' }]}
                                                        {...getFieldProps('leaseType', {
                                                            onChange: this.handleChangeLease_method,
                                                            initialValue: formObject.leaseType,
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
                                                        事件类别
                                                    </Label>
                                                    {/**
                                                     金额数字组件FormInputNumber 除固有属性外
                                                     toThousands为true时金额类型会做千分位的转换
                                                     toPercent为true时控制显示百分号 即用作百分比数据使用
                                                     precision定义保留小数位的位数                                                        toPercent={true}  //是否显示百分号
                                                     min控制数字金额的最小值 max控制数字金额的最大值
                                                     */}
                                                    <Select
                                                        data={[{ key: '租金', value: '6' }]}
                                                        {...getFieldProps('eventType', {
                                                            onChange: this.handleChangeLease_method,
                                                            initialValue: formObject.eventType,
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
                                                        期次
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('periodTime', {
                                                                initialValue: formObject.periodTime,
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
                                                        应收日期
                                                    </Label>
                                                    {/**
                                                     日期组件DatePicker 除固有属性外 加入format处理格式类型
                                                     */}
                                                    <DatePicker
                                                        {
                                                            ...getFieldProps('receivableDate', {
                                                                initialValue: formObject.receivableDate,
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
                                                        应收金额
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('receivableAmount', {
                                                                initialValue: formObject.receivableAmount,
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
                                                        应收本金
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('receivableCorpus', {
                                                                initialValue: formObject.receivableCorpus,
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
                                                        应收利息
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('receivableInterest', {
                                                                initialValue: formObject.receivableInterest,
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
                                                        剩余本金
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('surplusCorpus', {
                                                                initialValue: formObject.surplusCorpus,
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
                                                        到账金额
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('intoAccountAmount', {
                                                                initialValue: formObject.intoAccountAmount,
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
                                                        到账日期
                                                    </Label>
                                                    {/**
                                                     日期组件DatePicker 除固有属性外 加入format处理格式类型
                                                     */}
                                                    <DatePicker
                                                        {
                                                            ...getFieldProps('intoAccountDate', {
                                                                initialValue: formObject.intoAccountDate,
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
                                                        核销状态
                                                    </Label>
                                                    {/**
                                                     金额数字组件FormInputNumber 除固有属性外
                                                     toThousands为true时金额类型会做千分位的转换
                                                     toPercent为true时控制显示百分号 即用作百分比数据使用
                                                     precision定义保留小数位的位数                                                        toPercent={true}  //是否显示百分号
                                                     min控制数字金额的最小值 max控制数字金额的最大值
                                                     */}
                                                    <Select
                                                        data={[{ key: '未核销', value: '0' }, { key: '部分核销', value: '1' }
                                                            , { key: '已核销', value: '2' }]}
                                                        {...getFieldProps('verificationState', {
                                                            onChange: this.handleChangeLease_method,
                                                            initialValue: formObject.verificationState,
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
                                                        核销日期
                                                    </Label>
                                                    {/**
                                                     日期组件DatePicker 除固有属性外 加入format处理格式类型
                                                     */}
                                                    <DatePicker
                                                        {
                                                            ...getFieldProps('verificationDate', {
                                                                initialValue: formObject.verificationDate,
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
                                                        收款银行
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('gatherBank', {
                                                                initialValue: formObject.gatherBank,
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
                                                        收款帐号
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('gatherAccount', {
                                                                initialValue: formObject.gatherAccount,
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
                                                        核销金额
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('gatherBalance', {
                                                                initialValue: formObject.gatherBalance,
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
                                                        应收余额
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('receivableBalance', {
                                                                initialValue: formObject.receivableBalance,
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
                                                        实收本金
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('paidinCorpus', {
                                                                initialValue: formObject.paidinCorpus,
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
                                                        实收利息
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('paidinInterest', {
                                                                initialValue: formObject.paidinInterest,
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
                                                        是否逾期
                                                    </Label>
                                                    {/**
                                                     金额数字组件FormInputNumber 除固有属性外
                                                     toThousands为true时金额类型会做千分位的转换
                                                     toPercent为true时控制显示百分号 即用作百分比数据使用
                                                     precision定义保留小数位的位数                                                        toPercent={true}  //是否显示百分号
                                                     min控制数字金额的最小值 max控制数字金额的最大值
                                                     */}
                                                    <Select
                                                        data={[{ key: '是', value: '0' }, { key: '否', value: '1' }]}
                                                        {...getFieldProps('ifOverdue', {
                                                            initialValue: formObject.ifOverdue,
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
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('pkCurrency', {
                                                                initialValue: formObject.pkCurrency,
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
                                                        公司主体
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('companyBody', {
                                                                initialValue: formObject.companyBody,
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
                                                        来源系统
                                                    </Label>
                                                    <FormControl
                                                        {
                                                            ...getFieldProps('pkSys', {
                                                                initialValue: formObject.pkSys,
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
