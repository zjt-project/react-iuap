import React, { Component } from 'react';
import {Icon,Dropdown, Menu} from 'tinper-bee'; //引入官网文档内部组件
import Button from 'components/Button';         //引入本地使用的组件形式
import './index.less';                          //引入界面使用样式
import {checkBillStatus} from "utils/service";  //引入工具类函数


const { Item,Divider } = Menu;

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

    /**
     * 控制按钮可见
     * 权限 && 列表界面
     */
    powerGridView = (param,name) =>{
        let ifPower = param.ifPowerBtn;
        let isGrid = param.isGrid;
        //过滤后台按钮权限
        if(ifPower){
            if(param.powerButton && param.powerButton.length > 0){
                power = param.powerButton.includes(name);
            } else {
                power = false;
            }
        }
        return power && isGrid;
    };

    /**
     * 控制按钮可见
     * 权限 && Form界面
     */
    powerFormView = (param,name) =>{
        let ifPower = param.ifPowerBtn;
        let isGrid = param.isGrid;
        //过滤后台按钮权限
        if(ifPower){
            if(param.powerButton && param.powerButton.length > 0){
                power = param.powerButton.includes(name);
            } else {
                power = false;
            }
        }
        return power && !isGrid;
    };

    /**
     * 编辑状态下 =>可用 更改界面内部通过编辑态控制的按钮可用情况
     */
    powerDisabledEdit = (param) =>{
        let isEdit = param.isEdit;
        return !isEdit;
    };

    /**
     * 不可编辑状态 =>可用
     */
    powerDisabledUnEdit = (param) =>{
        let isEdit = param.isEdit;
        return isEdit;
    };

    /**
     * 不可编辑状态 && 单条数据 && 符合状态集合 =>可用
     */
    powerDisabledSingle = (param,status=[]) =>{
        let isEdit = param.isEdit;
        let selectList = param.selectedList;
        if(selectList && selectList.length == 1){
            return isEdit && !checkBillStatus(selectList[0],status);
        } else {
            return true;
        }
    };

    handleSelect = ({ key }) =>{
        this.props.Export(key);
    }

    /**
     * 个性化控制是否可用
     * 例如控制审批流中的权限等
     *  |修改按钮|
     */
    powerDisabledForSubmit = (param) => {


    };

    render() {
        let _props = this.props;
        let _this = this;
        const tableMenu = (
            <Menu className='tab-menu' onSelect={this.handleSelect} itemIcon={<Icon type='uf-setting-c-o'/>}>
                <Divider />
                <Item key="1">导出选中数据</Item>
                <Divider />
                <Item key="2">导出当前页</Item>
            </Menu>
        );

        return (

            <div className='table-header'>
                {/**Button按钮组件 visible是否显示控制 disabled是否可编辑 className样式 colors按钮颜色 onClick触发事件
                 Icon图标属性 定义在按钮内部当按钮需要以图标形式展示时使用 其中type属性为对应的图标样式 仅可使用官网样式图标
                 */}
                <Button visible={_props.isGrid} className="ml8" colors="primary" onClick={_props.Query}><Icon type='uf-search'/>查询</Button>
                <Dropdown trigger={['click']} overlay={tableMenu} animation="slide-up">
                    <Button visible={_this.powerView(_props,'Export') && _props.isGrid} className="ml8" colors="primary"><Icon type='uf-symlist'/>导出</Button>
                </Dropdown>
                {/*<Button visible={_props.isEdit} disabled={_this.powerDisabledEdit(_props)} className="ml8" colors="primary" onClick={_props.Save}><Icon type='uf-search'/>保存</Button>*/}
                <Button visible={!_props.isGrid}  className="ml8" colors="primary" onClick={_props.Return}><Icon type='uf-search'/>返回</Button>
                {/*<Button visible={_this.powerView(_props,'ViewFlow')} disabled={_this.powerDisabledSingle(_props,['204','9'])} className="ml8 yl-r-b" colors="primary" onClick={_props.ViewFlow}><Icon type='uf-setting-c-o'/>查看流程图</Button>*/}
                {/*<Button visible={_this.powerView(_props,'Check')} disabled={_this.powerDisabledSingle(_props,['204'])} className="ml8 yl-r-b" colors="primary" onClick={_props.Check}><Icon type='uf-seal'/>审核</Button>*/}
                {/*<Button visible={_this.powerView(_props,'Submit')} disabled={_this.powerDisabledSingle(_props,['20','99'])} className="ml8 yl-r-b" colors="primary" onClick={_props.Submit}><Icon type='uf-flow-o'/>提交</Button>*/}
                {/*<Button visible={_this.powerView(_props,'Edit')} disabled={_this.powerDisabledUnEdit(_props)} className="ml8 yl-r-b" colors="primary" onClick={_props.Edit}><Icon type='uf-pencil-s'/>修改</Button>*/}
                {/*<Button visible={_this.powerView(_props,'Add')} disabled={_this.powerDisabledUnEdit(_props)} className="ml8 yl-r-b" colors="primary" onClick={_props.Add}><Icon type='uf-add-c-o'/>新增</Button>*/}
                {/* <Button visible={_props.isGrid} className="ml8 yl-r-b" colors="primary" onClick={_props.View}><Icon type='uf-files-o'/>查看</Button> */}
                <Button visible={_props.isGrid} className="ml8 yl-r-b" colors="primary" onClick={_props.GatherWithdraw}><Icon type='uf-files-o'/>汇总</Button>
            </div>

        );
    }
}

export default ButtonGroup;
