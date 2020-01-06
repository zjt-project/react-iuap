/**
 * 前端路由说明：
 * 基于浏览器 History 的前端 Hash 路由  (将对应节点的路由container.js路径注册到此文件中)
 */

import React , { Component } from "react";
import { Route } from "mirrorx";
import {ConnectedLogin} from "./login/container";


export default class LoginForm extends Component {
    render(){
        return (
            <div className="route-content">
                <div className="templates-route">
                    {/*配置根路由记载节点*/}
                    {<Route exact path={'/'} component={ConnectedLogin} />}
                </div>
            </div>
        )
    }
}