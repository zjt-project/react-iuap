/**
 * 下拉框
 */
import React, { Component } from "react";
import {  } from 'tinper-bee';
import { Icon, Select, Tooltip, Form } from "tinper-bee";
const Option = Select.Option;

class SelectEditCell extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      value: this.props.value?this.props.value:{key:'',value:''},
      editable: false
    };
  }

  handleSelect = value => {
    this.setState({ value });
  };

  commitChange = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };

  edit = () => {
    if(this.props.editable){
      this.setState({ editable: true });
    }
  };

  render() {
    const { value, editable } = this.state;
    const { data } = this.props;
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="editable-cell-input-wrapper">
            <Select
              defaultValue={this.props.value?this.props.value.value:""}
              value={value.value}
              onSelect={this.handleSelect}
              onBlur={this.commitChange}
              autoFocus
            >
              {data.map((item, index) => (
                <Option key={index} value={item}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          <div className="editable-cell-text-wrapper" onDoubleClick={this.edit.bind(this)}>
            {value?value.name:""}
          </div>
        )}
      </div>
    );
  }
}

export default Form.createForm()(SelectEditCell);