import React from 'react';
import {Button, Icon, Modal, Table, Tree} from 'tinper-bee';
import StringModel from 'components/GridCompnent/StringModel';
import EnumModel from 'components/GridCompnent/EnumModel';
import DateModel from 'components/GridCompnent/DateModel';
import RefModel from 'components/GridCompnent/RefModel'
import {deepClone} from "utils";


const TreeNode = Tree.TreeNode;   //树节点使用组件定义
const transData = [               //树节点使用假数据定义 后续从后端传入
    {
        title: "收款批次",
        key: "capitalBatchNo",
        _edit:true,
        fixcon:true,
        type:'String',
        between:false,
    }
];

const dataSource = [];

class SearchPanel extends React.Component {
    constructor(props) {
        super(props);
        /**
         * 自定义列表的表头 如存在一些不可由标准类型处理的标题 则可由以下形式自定义标题
         * title:列名称
         * dataIndex:列索引 对应字段属性
         * key:唯一性主键 对应字段属性
         * width:单标题表头的宽度
         */
        this.columns = [
            {
                title: "",dataIndex: "fixcon",key: "fixcon",width: 30,
                render: (text, record, index) => {
                    /**
                     * render箭头函数中 可由以下形式自定义条件渲染的结果
                     */
                    return (
                        <div>
                            {record.fixcon ?<div><a><Icon type="uf-correct"></Icon></a></div>
                                :<div><a href="javascript:void(0)" onClick={()=> this.oncancelTable(index)}><Icon type="uf-close"></Icon></a></div>}
                        </div>
                    )
                }
            },
            {
                title: "条件名称",
                dataIndex: "title",
                key: "title",
                width:100,
            },
            // {
            //     title: "比较条件",
            //     dataIndex: "key",
            //     key: "key",
            //     width:100,
            //     render: (text, record, index) => {
            //         //字符串数值不存在介于区间   参照类型只有等于选择     日期类型存在介于区间  此处分类处理
            //         if(record.type=='String'){
            //             return <EnumModel text={text} record={record} index={index} type={'compareCon'} dataIndex = {'condition'} onChange={this.onCellChange(index, "key")} />
            //         }else if(record.type=='Date'){
            //             return <EnumModel text={text} record={record} index={index} type={'datecompareCon'} dataIndex = {'condition'} onChange={this.onCellChange(index, "key")} />
            //         }else if(record.type=='Ref'){
            //             return <EnumModel text={text} record={record} index={index} type={'compareCon'} dataIndex = {'condition'} onChange={this.onCellChange(index, "key")} />
            //         }

            //     }
            // },
            {
                title: "条件内容",
                dataIndex: "content",
                key: "content",
                width: 100,
                render: (text, record, index) => {
                    if(record.type=='String'){
                        return <StringModel text={text} record={record} index={index} dataIndex={'content'}/>
                    }else if(record.type=='Date'&&!record.between){
                        return <DateModel text={text} record={record} index={index} dateFormat={"YYYY-MM-DD"} dataIndex={'content'}  />
                    }else if(record.type=='Date'&&record.between){
                        return <div className = "between_model"><DateModel  record={record} index={index} dateFormat={"YYYY-MM-DD"} dataIndex={'content'}  /><span>-</span>
                            <DateModel text={text} record={record} index={index} dateFormat={"YYYY-MM-DD"} dataIndex={'content1'}  /></div>
                    }else if(record.type=='Ref'){
                        return <div className = "ref_model"><RefModel  record={record} index={index} dataIndex={'content'}/></div>
                    }
                }
            },
        ];
        this.state = {
            dataSource: dataSource,   //条件查询的结果数据
            transData:transData,      //条件查询的列表数据
            columns:this.columns,     //表格对应的标题
        };
    }

    //组件生命周期方法-在渲染前调用,在客户端也在服务端
    componentWillMount() {
        //初始化时将指定固定查询条件提前置入结果集合中
        this.state.transData.map((value,key)=>{
            if(value.fixcon){
                this.state.dataSource.push({
                    _edit:true,
                    title:value.title,
                    key:value.key,
                    fixcon:true,
                    type:value.type,
                    between:value.between,
                    condition:0,
                    content:'',
                })
                this.setState({ dataSource });
            }
        })
    }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount() {
        this.props.onRef(this);
        let _dataSource = deepClone(this.state.dataSource);
        let store = JSON.parse(localStorage.getItem('loandealsearch'));
        if(store!=undefined&&store!=null&&store.length>0){
            store.map((item,key)=>{
                if(!item.fixcon){
                    _dataSource.push(item);
                }
            });
            this.setState({dataSource:_dataSource});
        }
    }
    //使用index对应修改元数据的查询条件值
    onCellChange = (index, key) => {
        return value => {
            const _dataSource = deepClone(this.state.dataSource);
            if(key=='key'){
                if(value=='6'){
                    _dataSource[index]['between']=true;
                    this.setState({ dataSource:_dataSource});
                }else{
                    _dataSource[index]['between']=false;
                    this.setState({ dataSource:_dataSource});
                }
            }
        };
    };
    //树节点双击事件
    onDoubleClick = (checkedKeys, e)=>{
        const currentIndex = this.state.dataSource.length;
        const _dataSource = deepClone(this.state.dataSource);
        _dataSource.push({
            index:currentIndex,
            _edit:true,
            title:e.node.props.title.props.children,
            key:checkedKeys,
            type:e.node.props.ext.type,
            between:e.node.props.ext.between,
            condition:0,
            content:'',
        })
        this.setState({ dataSource:_dataSource });
    }

    oncancelTable = (index) =>{
        const _dataSource = deepClone(this.state.dataSource);
        _dataSource.splice(index,1);
        this.setState({ dataSource:_dataSource});
    }
    //搜索重置按钮
    resetSearch = () =>{
        this.setState({
            dataSource:[]
        })
    }

    alterSerach = ()=>{
       let queryData={};
       this.state.dataSource.map((item,key)=>{
        if(item != undefined && item.key != undefined && item.content != undefined && item.content != ''){
          queryData[item.key] = item.content;
        }
      });
      return queryData;
    }


    render() {
        const IfShow = this.props.IfShow;
        return (
            <div>
                <Modal
                    show={IfShow}
                    onHide={this.props.closeSearch}
                    size="lg"
                    backdrop="static"
                    centered="true"
                    width="600"
                    dialogClassName="search_form"
                >
                    <div className="modal_header">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                查询信息
                            </Modal.Title>
                        </Modal.Header>
                    </div>

                    <Modal.Body>
                        <div className="search_form_left">
                            {/**
                             树形结构组件Tree 需要以树形式展示数据时使用此组件
                             defaultExpandAll:为true时代表默认展开所有子树节点
                             showIcon:定义即为是否展示对应树节点前的小图标
                             showLine:定义即为是否展示对应树节点的关联线条
                             openIcon closeIcon 分别对应展开与收缩树节点的图标
                             getScrollContainer:对应树节点的其他自定义样式 无法直接使用className使用
                             onDoubleClick:双击树节点触发事件
                             */}
                            <Tree
                                defaultExpandAll ={true}
                                showIcon
                                showLine
                                openIcon={<Icon type="uf-minus" />}
                                closeIcon={<Icon type="uf-plus" />}
                                getScrollContainer={() => {
                                    return document.querySelector('.search_form_left')
                                }}
                                onDoubleClick = {this.onDoubleClick}
                            >
                                {/**
                                 子组件定义树节点TreeNode 树中显示的所有树节点均由此定义 嵌套使用完成主子树间的关联
                                 其中title:树节点名称(必有)
                                 key:树节点唯一性主键(必有)
                                 icon:树节点前小图标(选择性定义)
                                 ext:树节点其他自定义属性由此填入
                                 */}
                                <TreeNode title="所有条件" key="all_condition" icon={<Icon type="uf-treefolder" />}>
                                    {
                                        this.state.transData.map((value,key)=>{
                                            return <TreeNode title={<span>{value.title}</span>} key={value.key} icon={<Icon type="uf-list-s-o" />}  ext={{'type':value.type,'between':value.between}} />
                                        })
                                    }
                                </TreeNode>
                            </Tree>
                        </div>
                        <div className="search_from_right">
                            <Table data={this.state.dataSource} columns={this.state.columns} height={30}/>
                        </div>
                    </Modal.Body>
                    <div className="search_from_right_footer">
                        <Modal.Footer>
                        <div>
                            <Button colors="primary" style={{ marginRight: 8, marginTop: -25, border: 0 }} onClick={this.props.alterSerach}>
                                确认
                            </Button>
                            <Button colors="primary" style={{ marginRight: 8, marginTop: -25, border: 0 }} onClick={this.props.closeSearch}>取消</Button>
                            <Button style={{ marginTop: -25, border: 0 }} onClick={this.resetSearch} >重置</Button>
                        </div>
                        </Modal.Footer>
                    </div>
                </Modal>

            </div>
        );
    }
}


export default SearchPanel
