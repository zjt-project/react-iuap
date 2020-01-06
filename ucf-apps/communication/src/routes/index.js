/**
 * 前端路由说明：
 * 基于浏览器 History 的前端 Hash 路由
 */

import React from "react";
import { Route } from "mirrorx";
import {CommunicationContract} from "./contract/container";
import {CommunicationInvoice} from "./invoice/container";
import {CommunicationCustomer} from "./customer/container"
import {CommunicationWithdraw} from "./withdraw/container";
import {CommunicationCapital} from "./capital/container";
import {CommunicationAccrued} from "./accrued/container"
import {CommunicationCbOverdueContract} from "./cbOverdueContract/container"
import {CommunicationCbBadContract} from "./cbBadContract/container"
import {CommunicationCbEarlySettlement} from "./cbEarlySettlement/container"
import {CommunicationLoadlog} from "./loadlog/container"

export default () => (
    <div className="route-content">
        <Route exact path='/contract' component={CommunicationContract} />
        <Route exact path='/invoice' component={CommunicationInvoice} />
        <Route exact path='/customer' component={CommunicationCustomer} />
        <Route exact path='/accrued' component={CommunicationAccrued} />
        <Route exact path='/withdraw' component={CommunicationWithdraw} />
        <Route exact path='/capital' component={CommunicationCapital} />
        <Route exact path='/cbOverdueContract' component={CommunicationCbOverdueContract} />
        <Route exact path='/cbBadContract' component={CommunicationCbBadContract} />
        <Route exact path='/cbEarlySettlement' component={CommunicationCbEarlySettlement} />
        <Route exact path='/cbloadlog' component={CommunicationLoadlog} />
    </div>

);
