/**
 * 自定义初始默认模块
 */

import React, { Component } from 'react';
import { Loading,Form } from 'tinper-bee';
import {actions} from 'mirrorx';
import {singleRecordOper} from "utils/service";
import { deepClone,Info } from "utils";
import ButtonGroup from './ButtonGroup';
import ListView from './ListView';
import FormView from './FormView';
import moment from 'moment';
import './index.less';
import SearchPanel from './SearchPanel'

class IndexView extends Component {
    /**
     * 当前界面内部构造函数 固定格式需添加super(props) 仅需当前界面内部使用的数据可以定义在this.state中
     */
    constructor(props) {
        super(props);
        //在路由时带出此节点权限按钮  后续会从后台传入
        /**临时测试数据 */
        props.powerButton = ['Query','Export','Return'];
        props.ifPowerBtn = true;
        /**临时测试数据 */
        props.gridColumn = ['customerCode','customerName','identityType','identityNo','birthday','issuingAuthority','validTerm'
                            ,'age','sex','levelOfEducation;contact','marryStatus','childrenStatus','childrenSchoolStatus'
                            ,'industryType','private','Integer officalTitle','job','permanentAddress','homeAddr'];
        props.ifGridColumn = true;
        
        this.state = {
            showFormView : 'none',//显示Form表单
            ifPowerBtn:props.ifPowerBtn,//是否控制按钮权限
            powerButton: props.powerButton,//按钮权限列表
            ifGridColumn:props.ifGridColumn,//是否自定义显示字段
            gridColumn: props.gridColumn,//显示字段  
            showSearchPanel:false,          
        };
        
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        actions.customer.updateState({powerButton:this.props.powerButton});
        actions.customer.updateState({ifPowerBtn:this.props.ifPowerBtn});
        actions.customer.updateState({gridColumn:this.props.gridColumn});
        actions.customer.updateState({ifGridColumn:this.props.ifGridColumn});
        
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        
    }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
        
    }
    

    //绑定子组件的引用  使用子组件的地方添加此方法的实现 其中 formchild为调用子组件方法时使用的名字 通过this.formchlc.+方法名调用子组件的方法
    onRef = (ref) => {
        this.child = ref;        
    }

    onListRef = (ref) =>{
        this.listchild = ref;
    }

    onsearchRef = (ref) =>{
        this.serachRef = ref;
    }

    /**
     * 切换为列表界面
     */
    switchToListView = () =>{
        this.setState({
            showListView:'',
            showFormView:'none',
        })
        actions.customer.updateState({ formObject : {},isGrid : true,isEdit : false, showForm : false});
    }

    /**
     * 切换为卡片界面
     */
    switchToCardView = (obj) =>{
        let _formObj = deepClone(obj);  
        this.setState({
            showListView:'none',
            showFormView:'',
            formObject:_formObj,
        }) 
              
        actions.customer.updateState({ formObject : _formObj,isGrid : false,isEdit : false, showForm : true});
    }

    /**
     * Form表单更改编辑状态
     */
    switchEdit = () =>{
        actions.customer.updateState({isEdit : !this.props.isEdit});
    }
    /**
     * 查询方法
     */
    onQuery = () =>{
        this.setState({
            showSearchPanel:true
        })
    }

    oncloseSearch = () =>{
        this.setState({
            showSearchPanel:false,
        })
    }

    onalterSearch = () =>{
        const queryData = this.serachRef.alterSerach();
        let queryParam = {
            pageIndex: 1,
            pageSize: this.props.queryParam.pageSize,
            queryData: '{}'==JSON.stringify(queryData)?null:queryData
        };
        actions.customer.loadList(queryParam);
        //console.log(queryData);
        //localStorage.setItem('testdemosearch',JSON.stringify(queryData));
        this.setState({
            showSearchPanel:false,
        })
    }

     /**
     * 当前页按钮点击事件  添加数据  所有页面内部函数统一采用Es6箭头函数语法形式 避免this指针获取不到存在错误的问题
     */
    onAdd = () =>{
        let objectForm = localStorage.getItem("addKey");
        if(objectForm){
            let _formObject = deepClone(JSON.parse(objectForm));
            actions.customer.updateState({formObject:_formObject});
        }else{
            
        }
        //填出新增窗口
        actions.customer.updateState({showModal : true});      
    }


    /**
     * 修改按钮
     */
    onEdit = () =>{
        singleRecordOper(this.props.selectedList,(param) => {
            this.switchToCardView(param);
            this.switchEdit();
        });        
    }

    /**
     * 查看按钮
     */
    onView = () =>{
        singleRecordOper(this.props.selectedList,(param) => {  //查看选中项数据前进行一次单选校验
            this.switchToCardView(param);
            actions.customer.updateState({bt:false});
        });
    }

    /**
     * 导出数据按钮 使用GridMain组件中定义的引用ref直接调用即可导出数据
     */
    onClickExport = (key) => {
        //先判断选定是导出当前选中数据还是当前页数据 
        this.listchild.setExportList(key);
    }

    /**
     * 返回按钮
     */
    onReturn = () =>{
        if(this.props.isEdit){
            this.switchEdit();
        }
        this.switchToListView();
    }

    // 保存当前界面的编辑数据
    onSave = () => {
        let obj = this.child.submit();
        let _formObj = deepClone(this.props.formObject);
        Object.assign(_formObj,obj);
        actions.customer.updateRowData({'record':_formObj});
        this.switchEdit();
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        
        let ButtonPower = {
            PowerButton : this.state.powerButton,
            ifPowerBtn : this.state.ifPowerBtn,
            isGrid : this.props.isGrid,
            isEdit : this.props.isEdit,
        }



        return (            

            <div className='project-info'>
            {/**Loadging组件 页面内部加载图标 showBackDrop对应是否显示遮罩层 show为是否展示属性 fullScreen对应是否全屏遮罩 */}
                <Loading showBackDrop={true} show={this.props.showLoading} fullScreen={true}/>
                <div>
                    <ButtonGroup
                        BtnPower= {ButtonPower}    
                        Query= {this.onQuery}
                        Export={this.onClickExport}
                        Edit= {this.onEdit}
                        Add= {this.onAdd}
                        View={this.onView}
                        Return={this.onReturn}
                        Save={this.onSave}
                        {...this.props}
                    />
                </div>
                {/**所有页面内部添加组件必须由html内部标签如div标签等包裹 便于维护样式 且避免报错 */}
                <div style={{display:this.state.showListView}}>
                    <ListView {...this.props}　onListRef={this.onListRef} />
                </div>      
                <div style={{display:this.state.showFormView}}>
                    <FormView {...this.props} onRef={this.onRef}/>
                </div>
                <div>
                    <SearchPanel {...this.props} IfShow = {this.state.showSearchPanel} onRef = {this.onsearchRef} closeSearch={this.oncloseSearch} alterSerach={this.onalterSearch}/>
                </div>
            </div>
            
        );
    }
}

export default Form.createForm()(IndexView);
