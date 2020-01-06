/**
 * Created by yuzhao on 2017/6/7.
 */

import React,{Component} from 'react';
import {Navbar,Menu,Button,Con,Col,Tile,Icon} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
import * as api from "../../service";
import {getCookie} from "utils";

const SubMenu = Menu.SubMenu;
// 接口返回数据公共处理方法，根据具体需要
import { processData } from "utils";
import cookie from "react-cookie";

class UserMenus extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.state = {
            userMenus:[]
        };
    }
    formmaterUrl(item) {
        var uri = " ";
        if(item.menuProperty === 'third_menu'){
          var target = "";
          if(target){
            uri = item.menuPath;
          }else{
            uri = '#/ifr/' + encodeURIComponent(encodeURIComponent(item.menuPath));
          }
          return uri;
        }else{
          return item.menuPath;
        }
        // var uri = " ";
        // if (item.urlType === 'url') {
        //     var target=item.openview=="blank"?"_blank":"";
        //     if(target){
        //         uri = '#/ifrNoHead/' + encodeURIComponent(encodeURIComponent(item.url));
        //     }else{
        //         uri = '#/ifr/' + encodeURIComponent(encodeURIComponent(item.url));
        //     }
        //     return  uri;
        // } else if (item.urlType === 'plugin') {
        //     uri = item.code ? ('#/' + item.code) : "#/index_plugin";
        //     //window.registerRouter(uri.replace("#", ""), item.location);

        //     uri = `${GROBAL_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html'+uri));
        //     return  uri;
        // } else if (item.urlType === 'view') {
        //     uri = item.code;

        //     uri= uri.replace("#", "/");

        //     return `${GROBAL_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html#'+uri));

        // }else if(item.urlType == undefined){
        //     item.code = '404';
        //     return  '#/ifr/' + encodeURIComponent(encodeURIComponent(item.code));
        // }
        // else {
        //     return item.code;
        // }
    }

    logout = () =>{
      actions.app.logout();
    }

    async componentDidMount(){

        //调用 loadUserMenuList 请求数据
        let res = processData(await api.loadUserMenuList());
        let data = res && res.data?res.data:[]
        window.sessionStorage.setItem('userMenuData',JSON.stringify(data));
        this.setState({
            userMenus: data
        });

    }
    handleClick (e,reload,item) {
        this.props.handleClick(e,reload,item);
    }

    render() {

        var self = this;
        let {intl} = this.props;
        let locale_serial = getCookie("locale_serial");
        if(locale_serial == 1) {
            locale_serial = "";
        }
        let user = JSON.parse(localStorage.getItem("user"));
        let portalId = `${GROBAL_PORTAL_ID}`;
        return (
            <div mode="horizontal" className="dropdown header-right-dropdown" style={{ width: '100%' }}>
                {<div className="header-right-info">
                    <div role="button" id="username"  aria-expanded="false" data-toggle="dropdown" className="navbar-avatar dropdown-toggle">
                        {/* <span className="avatar-name"> {decodeURIComponent(decodeURIComponent(cookie.load('_A_P_userName')))} </span> */}
                        <span className="avatar-name"> {user != null ? user.userName : '测试用户'} </span>
                        <span className="header-right-icon"><i className="uf uf-treearrow-down"></i></span>
                    </div>
                </div>}
                <div className="header-right-applet-content">
                  <div className="header-right-applet-list">
                    {
                      this.state.userMenus.map(function(item) {
                        return (
                          <div className="header-right-applet" onClick={(e) => self.handleClick(e,'',item)}>
                          <a ref={item.code} value={item.code} onClick={ item.urlType==="url_blank"?"":(e) => self.props.handleDefault(e)}
                             target={item.urlType==="url_blank"?"_blank":"_self"}
                             item={JSON.parse(JSON.stringify(item))}
                             name={item['name'+locale_serial]} title={item['name'+locale_serial]} href={item.urlType==="url_blank"?item.url: self.formmaterUrl(item)}>
                             <div className="header-right-applet-icon"><i className={item.icon}></i></div>
                             <div className="header-right-applet-text">{item['name'+locale_serial]}</div>
                          </a>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="header-right-applet-logout">
                    <a ref="setting3" title={intl.formatMessage({id: 'tabs.header.signout'})}  value="logout" onClick={this.logout}><i aria-hidden="true" className="qy-iconfont icon-tubiao-zhuxiao"></i>{intl.formatMessage({id: 'tabs.header.signout'})} </a>
                  </div>
                </div>
            </div>
        )
    }
}

export default UserMenus;
