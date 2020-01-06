/**
 * 入口、导入组件样式、渲染
 */

import '@babel/polyfill';
import React, { Component } from "react";
import mirror, { render,Router } from "mirrorx";
import MainLayout from "./layout";
import Routes from './routes'
import 'tinper-bee/assets/tinper-bee.css'
import Intl from 'components/Intl/index.js'

import './app.less';


render(
<Intl>    
    <Router>
        <MainLayout Routes={Routes} />
    </Router>
</Intl>, document.querySelector("#app"));