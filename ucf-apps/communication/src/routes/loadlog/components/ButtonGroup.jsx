import React, { Component } from 'react';
import {Icon } from 'tinper-bee'; //引入官网文档内部组件
import Button from 'components/Button';         //引入本地使用的组件形式
import './index.less';                          //引入界面使用样式


class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            power:props.BtnPower,
        };
    }

    /**
     * 按钮权限  控制当前页面内部指定按钮名称的可见情况 如对应model.js中的powerButton存在当前名称的按钮 则该按钮显示
     */
    powerView = (param,name) => {
        //获取用户有权限的按钮,暂时写True,构建后台后再改。
        let power = false;

        if(param.powerButton && param.powerButton.length > 0){
            power = param.powerButton.includes(name);
        }
        return power;
    };

    render() {
        let _props = this.props;
        return (

            <div className='table-header'>
                <Button className="ml8" colors="primary" onClick={_props.Query}><Icon type='uf-search'/>查询</Button>
            </div>

        );
    }
}

export default ButtonGroup;
