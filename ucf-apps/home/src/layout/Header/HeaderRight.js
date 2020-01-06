import React,{Component} from "react";
import cookie from "react-cookie";
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip,Select} from 'tinper-bee';
import UserMenus from '../../components/UserMenu/UserMenu';
import Tenant from '../Tenant/Tenant';
import { actions } from 'mirrorx';
import {getCookie} from "utils";
import {getContextId} from 'utils';
const contextId = getContextId();
const Nav = Navbar.Nav;
const Option = Select.Option;
class HeaderRight extends Component {
    constructor(props) {
        super(props);
        actions.app.getLanguageList();
    }
    maxfunc(e) {
      this.props.headerRightOper.maxfunc(e);
    }
    minifunc(e) {
      this.props.headerRightOper.minifunc(e);
    }
    handleDefault(e,isDefault,item) {
      this.props.headerRightOper.handleDefault(e);
      this.props.handleClick(e,isDefault,item);
    }
    handleClick(e) {
      this.props.headerRightOper.handleClick(e);
    }
    componentWillMount () {

    }
    // themeChange = (val) => {
    //   this.props.headerRightOper.themeChange(val);
    // }
    handleChange = (val) => {
      actions.app.setLocaleParam(val);
    }
    /**
     * 语种切换下拉
     */
    initOption = (type,data) =>{
        let body=[];
        data.map((option,i) => (
            body.push(<Option className={"login-"+type+"-option"} value={option.code} key={option.code}>{option.name}</Option>)
        ));
        return body;
    }
    render() {
      var self = this;
      let {intl, unreadMsg, UserMenuObj,maxed,langCode,langList} = this.props;
      let locale_serial = getCookie("locale_serial");
      if(locale_serial == 1) {
          locale_serial = "";
      }
      let item1 = {
        name: '消息中心',
        name2: 'Message Center',
        name3: '消息中心',
        name4: '',
        name5: '',
        name6: ''
      }
      let item2 = {
        name: '任务中心',
        name2: 'Task Center',
        name3: '任務中心',
        name4: '',
        name5: '',
        name6: ''
      }
      let langDisplay = contextId === 'wbalone'? 'inline-block' : 'none';
        return (
            <div className="header-right">
              {cookie.load('loginChannel') ==='yht'?<div  className="header-right-tenant" onClick={(e)=>self.handleClick(e)}>
                      <Tenant {...UserMenuObj} />
                  </div>:""}
                {!maxed ?
                  <a id="maxBox" onClick={(e)=>self.maxfunc(e)}   data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.max'})} title={intl.formatMessage({id: 'tabs.header.max'})}  className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.max'})} >
                    <Icon type="uf-maxmize" style={{"fontSize":"18px"}}></Icon>
                  </a>:
                  <a id="maxBox" onClick={(e)=>self.minifunc(e)} data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.max'})} title={intl.formatMessage({id: 'tabs.header.max'})}  className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.max'})} >
                    <Icon type="uf-minimize" style={{"fontSize":"18px"}}></Icon>
                  </a>
                }
                <a id="taskCenterBox" value="taskcenter" onClick={(e)=>self.handleDefault(e,'',item2)} data-ref="taskcenter" name={item2['name'+locale_serial]} title={item2['name'+locale_serial]} href={`home#/ifr/portal#/taskcenter`} className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.task'})} >
                  <i className="pap pap-task"></i>
                </a>
                <a id="messageCount" value="msgCenter" onClick={(e)=>self.handleDefault(e,'',item1)} data-ref="msgCenter" name={item1['name'+locale_serial]}  title={item1['name'+locale_serial]}  href={`${GROBAL_HTTP_CTX}/index-view.html#/msgCenter`} className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.message'})}>
                  <i className="pap pap-massage u-badge" data-badge={unreadMsg} ></i>
                </a>
              <UserMenus {...UserMenuObj}/>
            </div>
        );
    }
}
export default HeaderRight;
