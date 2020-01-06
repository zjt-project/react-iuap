

import React, { Component } from 'react';
import { Loading,Form } from 'tinper-bee';
import {actions} from 'mirrorx';
import ButtonGroup from './ButtonGroup';
import ListView from './ListView';
import SearchPanel from './SearchPanel';
import './index.less';

class IndexView extends Component {
    constructor(props) {
        super(props);
        //在路由时带出此节点权限按钮  后续会从后台传入
        props.powerButton = ['Query'];
        props.ifPowerBtn = true;
        this.state = {
            showLoading : false, //加载状态
            ifPowerBtn:props.ifPowerBtn,//是否控制按钮权限
            powerButton: props.powerButton,//按钮权限列表
            showSearchPanel:false,        //查询diglog显示
        };
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        actions.communicationLoadlog.updateState({powerButton:this.props.powerButton});
        actions.communicationLoadlog.updateState({ifPowerBtn:this.props.ifPowerBtn});
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {

    }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {

    }

    onsearchRef = (ref) =>{
        this.serachRef = ref;
    }

    /**
     * 查询方法
     */
    onQuery = () =>{
        this.setState({
            showSearchPanel:true
        })
    };

    oncloseSearch = () =>{
        this.setState({
            showSearchPanel:false,
        })
    };

    onalterSearch = () =>{
        const queryData = this.serachRef.alterSerach();
        let queryParam = {
            pagination:{
                pageIndex: 1,
                pageSize: this.props.queryParam.pagination.pageSize,
            },
            querycondition: '{}'==JSON.stringify(queryData)?null:queryData
        };
        actions.communicationLoadlog.loadList(queryParam);
        this.setState({
            showSearchPanel:false,
        })
    };

    render() {
        let ButtonPower = {
            PowerButton : this.state.powerButton,
            ifPowerBtn : this.state.ifPowerBtn,
        };
        return (

            <div className='project-info'>
                <Loading showBackDrop={true} show={this.state.showLoading} fullScreen={true}/>
                <div>
                    <ButtonGroup
                        BtnPower= {ButtonPower}
                        Query= {this.onQuery}
                        {...this.props}
                    />
                </div>
                <div>
                    <ListView {...this.props} />
                </div>
                <div>
                    <SearchPanel {...this.props} IfShow = {this.state.showSearchPanel} onRef = {this.onsearchRef} closeSearch={this.oncloseSearch} alterSerach={this.onalterSearch}/>
                </div>
            </div>
        );
    }

}
export default Form.createForm()(IndexView);