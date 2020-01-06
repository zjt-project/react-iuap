import React, {Component} from 'react';
import {actions} from 'mirrorx';
import {Button, Form ,Checkbox, Select, FormControl, Icon} from 'tinper-bee';
import {  getCookie } from "utils";
import 'static/css/login.css';
import {
	RSAUtils
} from 'utils/rsautils';
const Option = Select.Option;

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        actions.login.getSystemList();
        window.setInterval(function () {
            let cookieLogints = getCookie('u_logints');
            if (!(cookieLogints == null || cookieLogints == '""' || cookieLogints == undefined || cookieLogints == '')) {
                var canOpen = window.localStorage.getItem("canOpen");
                if(canOpen === "true" || canOpen === null) {
                    window.localStorage.setItem("canOpen",false);
                    window.open(`/${GROBAL_PORTAL_ID}/home`, "_self");
                }
            }
        }, 1000);
        if(window.location.href !== window.top.location.href){ //解决登录页嵌套问题
            window.top.location.href=window.location.href ;
        }
        //本地缓存有最后一次登录用户名，则使用
        var lastLoginName = localStorage.getItem("lastLoginName");
        if (lastLoginName != undefined) {
            actions.login.updateState({
                username: lastLoginName,
            })
        }
        // 本地缓存有最后一次登录密码，则使用本地缓存标识字符串作为密码（用作标识功能，最终提交到后台的是缓存的密码密文）
        var lastLoginPassword = localStorage.getItem("lastLoginPassword");
        if (lastLoginPassword != undefined) {
            actions.login.updateState({
                password: 'USE_LOCALPASS_FLAG',
            })
        }
        // 使用缓存的记住密码勾选状态
        var lastLoginIsRemember = localStorage.getItem("lastLoginIsRemember")
        if (lastLoginIsRemember != undefined) {
            var booleanValue = lastLoginIsRemember === "true" ? true : false;
            actions.login.updateState({
                checked: booleanValue,
                lastLoginIsRemember: booleanValue
            })
        }
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

     /**
     * 输入框focus
     */
    clearMsg = () =>{
        actions.login.updateState({
            errMsg: ''
        })
    }

    /**
     * 切换系统
     */
    onSelect = (value) =>{
        actions.login.updateState({currentSystem:value,errMsg:''});
    }

    /**
     * 系统切换下拉
     */
    initOption = (type,data) =>{
        let body=[];
        data.map((option,i) => (
            body.push(<Option className={"login-"+type+"-option"} value={option.pkSystem} key={option.pkSystem}>{option.systemName}</Option>)
        ));
        return body;
    }

    /**
     * 输入框keydown事件
     */
    onEnter = (e) =>{
        if(e.which==13){
            if(e.target.id=="username"){
                this.refs.password.focus();
            }
            if(e.target.id=="password"){
                this.onSubmit();
            }
        }else if(e.target.id=="username"){
            let username = this.refs.username.value;
            if(username==""){
                this.refs.password.value="";
            }
        }
    }

    /**
     * 选择记住用户名
     */
    changeCheck=()=> {
        let nowChecked = !this.props.checked
        actions.login.updateState({
            checked: nowChecked
        })
        if(nowChecked){
            localStorage.setItem('lastLoginIsRemember', true);
        }else{
            localStorage.removeItem("lastLoginName");
            localStorage.removeItem("lastLoginPassword");
            localStorage.setItem('lastLoginIsRemember', false);
        }
    }

    /**
     * 提交
     */
    onSubmit = () =>{
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let currentSystem = this.props.currentSystem;
        //默认为C端通信系统 选定则转化为pk
        if(currentSystem == '中建投C端通信系统'){
            currentSystem = '22222222222222222222';
        }
        let data = {
            username: username,
            password: password,
        }
        if(!username){
            actions.login.updateState({
                errMsg: this.props.intl.formatMessage({id: 'ht.pag.log1.0004',defaultMessage:"请输入用户名"})
            })
            return;
        }
        if(!password){
            actions.login.updateState({
                errMsg: this.props.intl.formatMessage({id: 'ht.pag.log1.0007',defaultMessage:"请输入密码"})
            })
            return;
        }

        if(username && password && currentSystem){
            let DEdata = {};
            DEdata.text = password || '';
            DEdata.exponent = sessionStorage.getItem("exponent") || '';
            DEdata.modulus = sessionStorage.getItem("modulus") || '';

            var lastLoginPassword = localStorage.getItem("lastLoginPassword");
            if (lastLoginPassword && password === 'USE_LOCALPASS_FLAG') {
                password = lastLoginPassword;
            } else {
                password = RSAUtils.encryptedString(DEdata);
            }
            data.password = password;
            localStorage.removeItem("currentSystem");         //先删后增 避免上一步导致session未删除
            localStorage.setItem("currentSystem",currentSystem);
            actions.login.loginAjax(data);
        }
    }
    
    render() {
        let {errMsg,checked,username,password,currentSystem,systemList} = this.props; 
        return (            
            <div className="login-main">
            <div className="login-top"></div>
                <div className="login-content">
                    <div className="content-left"></div>
                    <div className="content-center"></div>
                    <div className="content-right">
                        <div className="login-panel-out">
                            <div  className="login-panel" style={{paddingTop:"55px",paddingBottom:"60px"}}>
                                <div><img className="login_logo" src={require('../../../../../../ucf-common/src/static/images/nc_logo.jpg')}></img></div>
                                <Select onSelect={this.onSelect} defaultValue={currentSystem}>
                                    {this.initOption("system",systemList)}
                                </Select>
                                    <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                                    <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>
                                    <input name="fakeusernameremembered" defaultValue={username} field="username" onFocus={this.clearMsg} ref="username" fieldname="用户名" id="username" onKeyDown={this.onEnter}    className="u-form-control text" type="text" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log2.0002',defaultMessage:"用户名"})}/>
                                    <input name="fakepasswordremembered" defaultValue={password} field="password" onFocus={this.clearMsg} ref="password" fieldname="密码" id="password" onKeyDown={this.onEnter}   className="u-form-control text" type="password" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log2.0003',defaultMessage:"密码"})}/>
                                    {/**
                                    <div className = "login_form">
                                        <FormControl
                                            type = "text"
                                            defaultValue = {username}
                                            size="md"
                                            suffix={<Icon type='uf-flag'/>}
                                        />

                                        <FormControl
                                            type = "password"
                                            defaultValue = {password}
                                            size="md"
                                            suffix={<Icon type='uf-flag'/>}
                                        />
                                    </div>
                                     */}
                                <div className="login-error2-msg" id="login-error-msg">{errMsg}</div>
                                <div className="login-btn">
                                    <Button field="loginBtn" fieldname="登陆" id="loginBtn" onClick = {this.onSubmit} className="btn" colors="danger">{this.props.intl.formatMessage({id: 'ht.pag.log1.0001',defaultMessage:"登录"})}</Button>
                                </div>
                                <div className="panel-oper">
                                <Checkbox field="remember" fieldname="记住账号"  onChange={this.changeCheck} checked={checked} className="inbox">{this.props.intl.formatMessage({id: 'ht.pag.log1.0011',defaultMessage:"记住用户名"})}</Checkbox>
                                </div>
                            </div>
                        </div>
                    </div>                
                </div>
            <div className="login-bottom">版权所有 ©2019-2020 中建投业务租赁股份有限公司</div>
            </div>
                     
        );
    }
}

export default Form.createForm()(LoginForm);