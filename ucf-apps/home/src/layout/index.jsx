import React, { Component } from "react";
import { Router,Switch,connect,withRouter,actions } from "mirrorx";

import "./index.less";
import "./animation.css";
import zhCN from 'components/Intl/locales/zh';

class MainLayout extends Component {
    constructor(props) {
        super(props);
    }
    changeLocale(){
        const {locale} = this.props;

        /**
         * 默认中文
         */
        let data = {
            locale: "zh_CN",
            localeData: zhCN
        }

        actions.intl.updateState(data)
    }
    render() {
        const {location,Routes} = this.props;
        const currentKey = location.pathname.split('/')[1] || '/'
        const timeout = { enter: 500, exit: 500 }
        return (

            <Switch location={location}>
                <Routes />
            </Switch>

        );
    }
}

export default  withRouter(connect(state => state.intl)(MainLayout))
