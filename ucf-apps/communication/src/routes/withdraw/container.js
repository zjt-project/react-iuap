/**
 * 容器类组件 注册当前节点的初始界面 并绑定当前界面所绑定的数据属性model  注意与外层路由index.js注册路由名称一致 否则无法自动寻址
 */

// 引用mirrorx作为connect
import mirror, { connect } from 'mirrorx';

// 默认页面组件
import IndexView from './components/IndexView';
//引用模型
import model from './model'

// 数据和组件UI关联、绑定
mirror.model(model);

export const CommunicationWithdraw = connect(state => state.communicationWithdraw)(IndexView);
