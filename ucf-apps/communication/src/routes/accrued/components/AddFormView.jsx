/**
 *
 * @title 结合切换事件的 Step组件完成主页面模态框形式新增数据
 * @description 点击next，Step的流程跟进
 *
 */
import React, { Component } from 'react';
import { Button, Modal, Form, Icon, Label, Col, Row, Select, FormControl, Tabs } from 'tinper-bee';
import { actions } from 'mirrorx';
import TableFormRef from 'components/FormRef/TableFormRef';
import { deepClone, Info, processData } from "utils";
import DatePicker from "tinper-bee/lib/Datepicker";
import * as api from "../service";
import './index.less';

const FormItem = Form.FormItem;   //表单组件使用定义   与上述情况相同

class AddFormView extends Component {
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

    //点击保存存储对应新增数据 移除缓存 并重置模态框
    async alertDone (){
        this.close();
        let objectForm = this.props.form.getFieldsValue();
        objectForm.pkOrg = JSON.parse(objectForm.pkOrg)
        // 正在加载数据，显示加载 Loading 图标
        actions.communicationAccrued.updateState({showLoading: true});
        let data = processData(await api.onAdd(objectForm));  // 调用 onAdd 请求数据
        let updateData = {showLoading: false};
        if(data.data.pkAccruedDetail != undefined && data.data.pkAccruedDetail.length > 0){
            updateData.isEdit = true;
            updateData.formObject = data.data;
            updateData.list3 = data.data.pkAccruedDetail;
            this.props.Edit();
        }else{
            updateData.isEdit = false;
            Info("没有可以计提的数据!")
        }
        actions.communicationAccrued.updateState(updateData); // 更新数据和查询条件
        
    }
    //关闭模态框
    close = () => {
        actions.communicationAccrued.updateState({ showModal: false });
    }

    render() {
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
                        show={this.props.showModal}
                        backdrop="static" //关闭遮罩事件
                        size={"md"} //小号模态框
                        width="520"
                        autoFocus={false}
                        enforceFocus={false}
                        dialogClassName="accrued_modal_form"
                        onHide={this.close}>
                        <Modal.Header closeButton>
                            <Modal.Title> 月末计提 </Modal.Title>
                        </Modal.Header>
                        <Modal.Body >

                            <div className="steps-content-accrued jic-form">
                                {/**
                                 表单内容组件Form 包含表单的内容放置在组件内部
                                 其中 Row Col 为处理格式的栅格布局 Row控制单行 Col 控制 md xs sm 即 中 大 小三种分辨率的列排序占比 单行12列
                                 FormItem为单个表单域 囊括 标签Label与输入框FormControl 其中输入框同样可以换为下拉框Select等组件
                                 FormControl的 getFieldProps为固定使用形式 内部填写当前单个表单域的属性名称
                                 initiaValue为表单初始默认值
                                 rules表单常用校验规则 内部required 为必输属性控制
                                 */}
                                <Form>
                                    <div>

                                        <Row>
                                            <Col md={6} xs={6} sm={6}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        机构
                                                    </Label>
                                                    <TableFormRef
                                                    {...this.props}
                                                    title={'机构'}
                                                    name={'pkOrg'}
                                                    refurl={'/sys/queryOrg'}
                                                    required={true}
                                                    />
                                                </FormItem>

                                            </Col>
                                            <Col md={6} xs={6} sm={6}>
                                                <FormItem>
                                                    <Label>
                                                        <Icon type="uf-mi" className='mast'></Icon>
                                                        计提期间
                                                    </Label>
                                                    {/**
                                                     日期组件DatePicker 除固有属性外 加入format处理格式类型
                                                     */}
                                                    <DatePicker
                                                        {
                                                            ...getFieldProps('accrualMonth', {
                                                                initialValue: formObject.accrualMonth,
                                                                rules: [{
                                                                    required: true,
                                                                }],
                                                            })
                                                        }
                                                        format={'YYYY-MM'}
                                              
                                                    />
                                                </FormItem>

                                            </Col>
                                        </Row>
                                    </div>
                                </Form>

                            </div>
                            <Modal.Footer>
                            <div className="steps-action">
                                <Button colors="primary" style={{ marginRight: 8 }} onClick={() => this.alertDone()}>完成</Button>
                                <Button colors="secondary" onClick={() => this.close()}> 关闭 </Button>
                            </div>
                            </Modal.Footer>

                        </Modal.Body>
                    </Modal>
                </div>
            );
        }
    }
}
export default Form.createForm()(AddFormView);