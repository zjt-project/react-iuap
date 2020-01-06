/**
 * @title 下拉参照
 * @description: 搜索框与下拉选择结合
 */
import React, { Component } from 'react';
import { Select } from 'tinper-bee';
import {requestBusiness} from "utils/business";
import { deepClone } from "utils";

const Option = Select.Option;

class TableComboxRef extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading:false,     //加载渲染
          refModelUrl: `${GROBAL_HTTP_CTX}`+this.props.refurl,    //参照查询的url 
          dataList:[],      //结果集数组,
          selectedValue:{}, //选中对象
        }; 
      }


    //组件生命周期方法-在第一次渲染后调用，只在客户端
    componentDidMount(){
        this.props.onRef(this); //绑定子组件
        this.loadData();
    }

    /**
     * @msg: 加载url数据
     */
    loadData = async (value) => {
        this.setState({
          loading:true,
        });
        let data = {};
        //根据输入值搜索
        if(value != undefined && value != null && value != ""){
            data = {where:{"retrieveName":value}}
        }else{
            data = {pagination : {pageIndex:1,pageSize:10}};
        }
        let requestList = [
            requestBusiness(data, this.state.refModelUrl),
        ];
        Promise.all(requestList).then(([response]) => {
            let dataRes = response.data.data;
            console.log(dataRes);
            this.setState({
                dataList : dataRes.pageData,
                loading: false,
            });
          }).catch((e) => {
            this.setState({
              loading: false,
            });
            console.log(e);
            return false;
          });  
    }

    /**
     * 获取选中对象数据
    */
    onSelect = (value,{props:{item}}) => {
        console.log(`selected ${value}`);
        console.log(`selected item `,item);
        this.setState({selectedValue:item})
    };
    /**
     * @msg: 搜索
     * @param {type} 
     * @return: 
     */
    onSearch  = (value) =>{
        console.log("搜索:"+value);
        this.loadData(value);
    }

    render() {
        let {dataList} = this.state;
        return (
            <div>
                <Select
                    showSearch supportWrite
                    style={{ width: 180, 'margin-left':'10px' }}
                    optionFilterProp="children" //option搜索回调支持
                    onSelect={this.onSelect}    //选中数据回调
                    onSearch={this.onSearch}    //搜索回调
                >
                {
                    dataList.map(da=><Option key={da.name} value={da.pk} item={da} >{da.name}</Option>)
                }
            </Select>
            </div>
        )
    }
}

export default TableComboxRef;



