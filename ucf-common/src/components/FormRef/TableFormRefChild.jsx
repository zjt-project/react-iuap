/**
 *
 * @title 子表参照
 * @description 清空功能：不使用form表单
 *
 */
import React, { Component } from 'react';
import { RefMultipleTableWithInput } from 'ref-multiple-table';
import 'ref-multiple-table/lib/index.css';
import { Button } from 'tinper-bee';
import Radio from 'bee-radio';
import 'bee-radio/build/Radio.css';
import request from 'utils/request.js'
import {actions} from 'mirrorx';

let options = {}
class TableFormRefChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      showLoading: false,
      showModal: false,
      matchData: [
        this.props.value?this.props.value:{} //参照中选中的对象
      ],
      value: this.props.value?JSON.stringify(this.props.value):"", //表单页显示的值
    };
    this.page = {
      pageCount: 0,
      pageSize: 10,
      currPageIndex: 1,
    };
    this.tableData = [];
    this.columnsData = [];
    this.refWarp = React.createRef();
  }

  componentDidMount(){
    this.loadData();
  }

  componentWillUpdata(nextProps, nextState){
    
  }

    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
    }


  /**
   * @msg: 请求mock数据，包含表头数据和表体数据
   * @param {type} 
   * @return: 
   */
  // loadData = async () => {
  //   let refModelUrl = {
  //     refInfo: 'https://mock.yonyoucloud.com/mock/1264/pap_basedoc/common-ref/refInfo',//表头请求
  //     tableBodyUrl: 'https://mock.yonyoucloud.com/mock/1264/pap_basedoc/common-ref/blobRefTreeGrid',//表体请求
  //   }
  //   let requestList = [
  //     request(refModelUrl.refInfo, { method: 'get' }),//表头数据
  //     request(refModelUrl.tableBodyUrl, { method: 'get' }), //表体数据
  //   ];
  //   Promise.all(requestList).then(([columnsData, bodyData]) => {
  //     this.launchTableHeader(columnsData.data);
  //     this.launchTableData(bodyData.data);
  //     this.setState({
  //       showLoading: false
  //     });
  //   }).catch((e) => {
  //     this.launchTableHeader({});
  //     this.launchTableData({});
  //     this.setState({
  //       showLoading: false
  //     });
  //     console.log(e)
  //   });
  // }

    /**
   * @msg: 请求mock数据，包含表头数据和表体数据 自定义
   * @param {type} 
   * @return: 
   */
  loadData = async () => {
    let data = {
      columnsData : {
        "strFieldCode":["code","name","email","mobile"],
        "strFieldName":["人员编码","人员名称","人员邮箱","人员电话"],
      },
      bodyData : {
        "data":[
          {"rownum_":1,"code":"001","mobile":"15011430230","name":"人员1","refcode":"001","refpk":"cc791b77-bd18-49ab-b3ec-ee83cd40012a","id":"cc791b77-bd18-49ab-b3ec-ee83cd40012a","refname":"人员1","email":"11@11.com"},
          {"rownum_":2,"code":"002","mobile":"15011323234","name":"人员2","refcode":"002","refpk":"de2d4d09-51ec-4108-8def-d6a6c5393c3b","id":"de2d4d09-51ec-4108-8def-d6a6c5393c3b","refname":"人员2","email":"22@11.com"},
          {"rownum_":3,"code":"003","mobile":"15011430232","name":"人员3","refcode":"003","refpk":"004989bb-a705-45ce-88f3-662f87ee6e52","id":"004989bb-a705-45ce-88f3-662f87ee6e52","refname":"人员3","email":"33@33.com"},
          {"rownum_":4,"code":"004","mobile":"15011430234","name":"人员4","refcode":"004","refpk":"3570cbde-0d43-49ce-ad53-ab27ee6ee7dd","id":"3570cbde-0d43-49ce-ad53-ab27ee6ee7dd","refname":"人员4","email":"33@34.com"},
          {"rownum_":5,"code":"005","mobile":"15011430235","name":"人员5","refcode":"005","refpk":"5e3a85ec-5e14-4734-8b3a-1e6168426c89","id":"5e3a85ec-5e14-4734-8b3a-1e6168426c89","refname":"人员5","email":"55@26.com"},
          
        ],
        "page":{"pageSize":10,"currPageIndex":0,"pageCount":2,"totalElements":15},
    } 
    };
    this.launchTableHeader(data.columnsData);
    this.launchTableData(data.bodyData);
    this.setState({
      showLoading: false
    });
  }

  /**
 * 根据 refinfo 返回结果拆解并渲染表格表头
 * @param {object} data 
   * 注意：单选时候自己添加radio
 */
  launchTableHeader = (data) => {
    if (!data) return;
    let { multiple, valueField } = options;
    let keyList = data.strFieldCode || [];
    let titleList = data.strFieldName || [];
    let colunmsList = keyList.map((item, index) => {
      return {
        key: item,
        dataIndex: item,
        title: titleList[index]
      }
    });
    if (colunmsList.length === 0) {
      colunmsList = [{ title: "未传递表头数据", dataIndex: "nodata", key: "nodata" }];
    } else if (!multiple) {
      colunmsList.unshift({
        title: " ",
        dataIndex: "a",
        key: "a",
        width: 45,
        render(text, record, index) {
          return (
            <Radio.RadioGroup
              name={record[valueField]}
              selectedValue={record._checked ? record[valueField] : null}
            >
              <Radio value={record[valueField]}></Radio>
            </Radio.RadioGroup>
          )
        }
      })
    }
    this.columnsData = colunmsList

  }
	/**
	 * 处理并渲染表格数据
	 */
  launchTableData = (response) => {
    if (!response) return;
    let { valueField } = options;
    let { data = [], page = {} } = response;
    data.map((record, k) => {
      record.key = record[valueField];
      return record;
    });
    this.tableData = data;
    this.page = {
      pageCount: page.pageCount || 0,
      currPageIndex: page.currPageIndex + 1 || 0,
      totalElements: page.totalElements || 0
    }
  }
  /**
   * @msg: 简单搜索的回调，与复杂搜索的回调不是同一个
   * @param {type} 
   * @return: 
   */
  miniSearchFunc = (value) => {
    alert('搜索' + value)
  }

  /**
   * 跳转到制定页数的操作
   * @param {number} index 跳转页数
   */
  handlePagination = (index) => {
    this.page.currPageIndex = index;
    this.setState({ number: Math.random() })
  }
	/**
	 * 选择每页数据个数
	 */
  dataNumSelect = (index, pageSize) => {
    console.log(index, pageSize)
  }
  /**
   * @msg: modal框确认按钮
   * @param {type} 
   * @return: 
   */
  onSave = (item) => {
    this.checkedArray = item;
    this.setState({
      showModal: false,
      matchData: item,
      value: JSON.stringify(item[0])
    })

  }
  /**
   * @msg: modal框右上X和右下角取消
   * @param {type} 
   * @return: 
   */
  onCancel = () => {
    this.setState({ showModal: false })
  }

  /**
   * @msg: 清空操作
   * @param {type} 此时value不可以直接传'',因为''下只能清除一次，第二次清除时前后value都是''，不会触发更新操作，
   * 因此通过refpk不一致来触发更新操作
   * @return: 
   */
  clearFunc = () => {
    this.setState({
      matchData: [],
      value: `{"refname":"","refpk":"${Math.random()}"}`,
    })
  }

  commitChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };

  onRefBlur = e => {
    // 消除点击子组件，父组件先失焦再聚焦的事件触发过程带来的副作用
    const __REF_CONTENT__ = document.querySelector("div.ref-core-modal");
    if (!__REF_CONTENT__ && e.target === this.refWarp) {
      this.commitChange();
      this.setState({ editable: false });
    }
  };

  edit = () => {
    if(this.props.editable){
      this.setState({ editable: true });
    }
  };

  render() {
  
    let { showLoading, showModal, matchData, value, editable } = this.state;
    let { columnsData, tableData, page } = this;
    //const { editable } = this.props;
    options = {
      miniSearch: true,
      multiple: false,
      valueField: "refpk",
      displayField: "{refname}",
    }
    let childrenProps = Object.assign({}, options, {
      showModal: showModal,
      showLoading: showLoading,
      columnsData: columnsData,
      tableData: tableData,
      ...page,
      matchData:matchData,
      value ,
      miniSearchFunc: this.miniSearchFunc,
      dataNumSelect: this.dataNumSelect,
      handlePagination: this.handlePagination,
      onSave: this.onSave,
      onCancel: this.onCancel,
    });
    return  editable ? (
        <div
          ref={el => (this.refWarp = el)}
          className="editable-cell-input-wrapper"
          tabIndex={-1}
          onBlur={this.onRefBlur}
        >
            <RefMultipleTableWithInput
              title = {this.props.title}
              {...childrenProps}
              //filterUrl={'https://mock.yonyoucloud.com/mock/1264/pap_basedoc/common-ref/blobRefTreeGrid'} //搜索地址
            />
        </div>
      ) : (
        <div className="editable-cell-text-wrapper" onDoubleClick={this.edit}>
          {matchData[0].refname || " "}
        </div>
      
      
      
    )
  }
}

export default TableFormRefChild;