/**
 * 入口、路由、导入组件样式、渲染页面
 */

import React from 'react';
import mirror, { render, Router } from 'mirrorx';
import Routes from './routes';
import Intl from 'components/Intl/index.js'
import MainLayout from "../../home/src/layout";

// 全局样式
import './app.less';
mirror.defaults({
    historyMode: "hash",
});
render(
    <Intl>    
        <Router>
            <MainLayout Routes={Routes} />
        </Router>
    </Intl>, document.querySelector("#login"));