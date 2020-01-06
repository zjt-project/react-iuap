import React, { Component } from 'react';
import {Select} from "tinper-bee";
import {enumConstant, enumConstantValue} from "utils/enums";
import './index.less';

class EnumModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.text,
          };
    }

    handleSelect = value => {
        this.setState({ value });
      };
    
      commitChange = () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.value);
        }
      };

      handleChange = (dataIndex,value) =>{
        this.props.record[dataIndex] = value;
      }


    render() {
        let {type,text,record,index,dataIndex} = this.props;
        let data = enumConstantValue(type, text);
        return <div>{data}</div>
        
        // if(data[text] != undefined){
        //   return <div>{data[text].key}</div>
        // }else{
        //   return <div>{text}</div>
        // }
        {/*
        return  ( 
              <div className="enum_model">
                <Select 
                    showSearch
                    autoFocus
                    placeholder="请选择..."
                    optionFilterProp="children"
                    data={data}
                    defaultValue={data[0].key}
                    onSelect={this.handleSelect}
                    onBlur={this.commitChange}
                    onChange ={this.handleChange.bind(this,dataIndex,type)}
                  />
              </div>
        );
        */}
    }
}

export default EnumModel;