import React, { Component } from 'react';
import {RefTreeWithInput} from'ref-tree';
import 'ref-tree/lib/index.css'
import request from "axios";
import './index.less';

class TableTreeRef extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData:[],
            refModelUrl: `${GROBAL_HTTP_CTX}`+this.props.refurl, //参照查询的url
            nodeDisplay: (record) => {
                return `${record.code}-${record.name}`
            },//树节点展示 点开参照展示内容格式
            displayField: (record) => {
                return `${record.name}`
            },//输入框内部内容展示格式
            inputDisplay:'{name}', //input框展示
            matchData:this.props.formObject[this.props.name]?[this.props.formObject[this.props.name]]:[],             //参照中选中的对象,
            value:this.props.formObject[this.props.name]?JSON.stringify({"refname":this.props.formObject[this.props.name]['name'],
            "refpk":this.props.formObject[this.props.name]['pk'],"name":this.props.formObject[this.props.name]['name'],"code":this.props.formObject[this.props.name]['code']
            ,"pk":this.props.formObject[this.props.name]['pk']}):"", //表单页显示的值　对应传输后台的值
            valueField:'pk',
        }   
    }
    componentDidMount(){
    }
    /**
     * @msg: 打开input右侧menu icon触发的操作
     * @param {type} 
     * @return: 
     */
    canClickGoOn = () =>{
        this.loadData();
        return true;//必须要有
    }
    /**
     * @msg: 请求mock数据
     */
    loadData = async () => {
        this.setState({
          loading:true,
        })
        let ajax={
            url: this.state.refModelUrl,
        };
        let response = await request(ajax);
        let results = response.data;
        let treeData = [];
        if (!results || !results.data.length){
          this.setState({ 
            loading:false,
          });
          return false;
        }
        treeData = results.data;
        this.setState({ 
          treeData,
          loading:false 
        });
        
    }
    /**
     * @msg: filterUrlFunc，快捷录入的回调函数
     * @param {type} 
     * @return: 
     */
    filterUrlFunc = (value) =>{
        //模拟过滤数据
        this.setState({
        })
    }
    /**
     * @msg: 搜索查询的回调函数
     * @param {type} 
     * @return: 
     */
    getRefTreeData = (value) =>{

    }
    /**
     * @msg: 保存的回调函数
     * @param {type} 
     * @return: 
     */
    onSave = (result) =>{
        this.setState({
            matchData:result,
        })
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const {treeData,matchData,value,valueField,nodeDisplay,displayField,inputDisplay} = this.state;
        return (
            <div>
                <RefTreeWithInput
                    className="ref-walsin-modal"
                    title={this.props.title}     //树参照标题
                    placholder="请输入...."　　   //输入框内部初始值
                    defaultExpandAll={false}     //初始默认不展开所有树节点
                    valueField={ valueField}     //真实 value 的键
                    nodeDisplay={ nodeDisplay}　 //树节点展示内容格式
                    displayField={displayField}  //显示内容的键
                    searchable={true}            //显示搜索框
                    inputDisplay={inputDisplay}  //输入框内展示内容格式
                    getRefTreeData={this.getRefTreeData}  //搜索查询的回调函数
                    filterUrlFunc={this.filterUrlFunc} //快捷录入回调函数
                    showLine={true}              //是否展示连接线
                    multiple={false}             //是否多选
                    onSave={this.onSave}         //保存回调函数
                    matchData={matchData}        //默认选择匹配数据
                    treeData={treeData}          //树节点显示数据
                    canClickGoOn={this.canClickGoOn} //打开树参照回调函数
                    backdrop="static"            //添加遮罩层 避免异常关闭
                    disabled={this.props.disabled}
                    {
                        ...getFieldProps(this.props.name, {   //因为参照的值特殊 此处特殊处理传值后再重写了getFieldProps
                          initialValue: value,
                          rules: [{
                            message: '请选择对应的'+this.props.formObject[this.props.name]['name'],
                          }]
                        })
                    }
                >
                </RefTreeWithInput>
            </div>
        )
    }
};
export default TableTreeRef;