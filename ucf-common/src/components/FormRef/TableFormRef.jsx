/**
 *
 * @title 表参照 form表单
 * @description 清空功能：不使用form表单
 *
 */
import React, { Component } from 'react';
import { RefMultipleTableWithInput } from 'ref-multiple-table';
import 'ref-multiple-table/lib/index.css';
import {requestBusiness} from "utils/business";
import './index.less';

let options = {}
class TableFormRef extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      showModal: false,
      refModelUrl: `${GROBAL_HTTP_CTX}`+this.props.refurl, //参照查询的url
      where :'',    //参照查询条件
      matchData: this.props.formObject[this.props.name] ? [
        this.props.formObject[this.props.name] //参照中选中的对象
      ]:[{}],
      value:this.props.formObject[this.props.name]?JSON.stringify({"refname":this.props.formObject[this.props.name]['name'],
      "refpk":this.props.formObject[this.props.name]['pk'],"name":this.props.formObject[this.props.name]['name'],"code":this.props.formObject[this.props.name]['code']
      ,"pk":this.props.formObject[this.props.name]['pk']}):'', //表单页显示的值      
      page : {
        pageCount: 0,  //总页数
        pageSize: 10,   //每页显示条数
        currPageIndex: 1,  //当前页数
        totalElements: 0,  //总条数
      }
    };
    this.tableData = [];
    this.columnsData = [];

  }

    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount(){
      this.loadData();
    }


    //组件生命周期方法-在组件接收到一个新的 prop (更新后)时被调用
    componentWillReceiveProps(nextProps) {
    }


  /**
   * @msg: 请求mock数据，包含表头数据和表体数据
   * @param {type}
   * @return:
   */
  loadData = async (value) => {
    let data = {
      where : {},
      pagination:{
        pageIndex : this.state.page.currPageIndex,
        pageSize : this.state.page.pageSize,
      }
    }
    //根据值搜索
    if(value != undefined && value != null){
      data.where = {"retrieveName":value};
    }else{
      data.where = {};
    }
    let requestList = [
      //request(this.state.refModelUrl, { method: 'post' , data:data }),//表头数据
      requestBusiness(data, this.state.refModelUrl),
    ];
    Promise.all(requestList).then(([response]) => {
      let data = response.data.data;
      let columnsData = {
        "strFieldCode" : data.strFieldCode,
        "strFieldName" : data.strFieldName,
      }
      let bodyData = {
        "data" : data.pageData,
        "page" : {pageCount:data.pageCount,total:data.total,pageSize:this.state.page.pageSize,pageIndex:this.state.page.currPageIndex},
      }
      this.launchTableHeader(columnsData);
      this.launchTableData(bodyData);
      this.setState({
        showLoading: false
      });
    }).catch((e) => {
      this.launchTableHeader({});
      this.launchTableData({});
      this.setState({
        showLoading: false
      });
      console.log(e)
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
      // colunmsList.unshift({
      //   title: " ",
      //   dataIndex: "pk",
      //   key: "pk",
      //   width: 45,
      //   render(text, record, index) {
      //     return (
      //       <Radio.RadioGroup
      //         name={record[valueField]}
      //         selectedValue={record._checked ? record[valueField] : null}
      //          onChange = { function onChange(value) {
      //            console.log(this);
      //           return this.getSelectedDataFunc(value,record,index);
      //         }}
      //       >
      //         <Radio value={record[valueField]}></Radio>
      //       </Radio.RadioGroup>
      //     )
      //   }
      // })
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
    this.setState({page:{pageCount: page.pageCount || 0,currPageIndex: page.pageIndex || 1,totalElements: page.total || 0,pageSize:page.pageSize || 5}});
  }
  /**
   * @msg: 简单搜索的回调，与复杂搜索的回调不是同一个
   * @param {type}
   * @return:
   */
  miniSearchFunc = (value) => {
    this.loadData(value);
  }

  /**
   * 以指定条件查询参照数据
   * @param where 查询条件 pagination 分页数据
   */
  loadDataByCondition = (where,pagination) =>{
    let data = {
      where : where,
      pagination : pagination,
    }
    let requestList = [
      //request(this.state.refModelUrl, { method: 'post' , data:data }),//表头数据
      requestBusiness(data, this.state.refModelUrl),
    ];
    Promise.all(requestList).then(([response]) => {
      let data = response.data.data;
      let bodyData = {
        "data" : data.pageData,
        "page" : {pageCount:data.pageCount,total:data.total,pageSize:pagination.pageSize,pageIndex:pagination.pageIndex},
      }
      this.launchTableData(bodyData);
      this.setState({
        showLoading: false
      });
    }).catch((e) => {
      this.launchTableData({});
      this.setState({
        showLoading: false
      });
      console.log(e)
    });

  }

  /**
   * 跳转到制定页数的操作
   * @param {number} index 跳转页数
   */
  handlePagination = (index) => {
    let pagination = {
      pageIndex : index,
      pageSize : this.state.page.pageSize,
    }
    this.loadDataByCondition(this.state.where,pagination);
  }
	/**
	 * 选择每页数据个数
	 */
  dataNumSelect = (index, pageSize) => {
    let pagination = {
      pageIndex : 1,
      pageSize : pageSize,
    }
    this.loadDataByCondition(this.state.where,pagination);
  }
  /**
   * @msg: modal框确认按钮
   * @param {type}
   * @return:
   */
  onSave = (item) => {
    this.setState({
      showModal: false,
      matchData: item,
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
      value: `{"name":"","pk":"${Math.random()}"}`,
    })
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    let { showLoading, showModal, matchData, value } = this.state;
    let { columnsData, tableData} = this;
    options = {
      miniSearch: true,            //是否添加搜索栏
      multiple: false,             //是否多选
      valueField: "pk",            //展示内容值主键
      displayField: "{name}",      //展示内容格式
    }
    let childrenProps = Object.assign({}, options, {
      showModal: showModal,      //是否展示参照
      showLoading: showLoading,  //请求数据时的过渡
      columnsData: columnsData,  //参照表头
      tableData: tableData,      //参照表体
      autoCheckedByClickRows : false,
      ...this.state.page,        //分页信息
      matchData:JSON.stringify(matchData) != "[{}]"?this.props.formObject[this.props.name]?this.props.formObject[this.props.name]:{} : matchData,       //匹配内容
      matchData:matchData,
      miniSearchFunc: this.miniSearchFunc,  //搜索框内容回调
      dataNumSelect: this.dataNumSelect,    //选择显示条数回调函数
      handlePagination: this.handlePagination,  //选择指定页码回调函数
      onSave: this.onSave,       //保存回调函数
      onCancel: this.onCancel,   //取消回调函数
      value: value!=""?this.props.formObject[this.props.name]?JSON.stringify({"refname":this.props.formObject[this.props.name]['name'],
               "refpk":this.props.formObject[this.props.name]['pk'],"name":this.props.formObject[this.props.name]['name'],"code":this.props.formObject[this.props.name]['code']
               ,"pk":this.props.formObject[this.props.name]['pk']}):"":value,
    });
    return (

      <div>
        <RefMultipleTableWithInput
        　className = "ref_table"
          disabled={this.props.disabled}
          title = {this.props.title}
          backdrop={false}
          {...childrenProps}
          {
            ...getFieldProps(this.props.name, {  //因为参照的值特殊 此处特殊处理传值后再重写了getFieldProps
              initialValue: value!=""?this.props.formObject[this.props.name]?JSON.stringify({"refname":this.props.formObject[this.props.name]['name'],
               "refpk":this.props.formObject[this.props.name]['pk'],"name":this.props.formObject[this.props.name]['name'],"code":this.props.formObject[this.props.name]['code']
               ,"pk":this.props.formObject[this.props.name]['pk']}):"":value,
              rules: [{
                message: '',
              }]
            })
        }
        />
      </div>
    )
  }
}

export default TableFormRef;
