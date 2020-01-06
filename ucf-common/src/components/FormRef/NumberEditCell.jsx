/**
 * 金额 千分位
 */
import React, { Component } from "react";
import {  } from 'tinper-bee';
import { Icon, Tooltip, Form } from "tinper-bee";
import InputNumber from 'components/InputNumber';

class NumberEditCell extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      value: parseInt(this.props.value),
      editable: false
    };
  }

  // handleSelect = value => {
  //   this.setState({ value });
  // };

  commitChange = () => {
    this.setState({ editable: false });
  };

  edit = () => {
    if(this.props.editable){
      this.setState({ editable: true });
    }
  };
  
  handleChange = value => {
    this.setState({ value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const { value, editable } = this.state;
    const { toThousands,precision } = this.props;
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="editable-cell-input-wrapper">
            <InputNumber
              defaultValue={value?parseInt(value):0}
              value={value}
              disabled = {false}
              onBlur={this.commitChange}
              onChange={this.handleChange}
              //autoFocus
              precision={precision?precision:false}
              toThousands = {toThousands?toThousands:true}  //是否显示千分位
              precision = {precision?precision:2} //精度
            />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper" onDoubleClick={this.edit.bind(this)}>
            {value?
              (parseInt(value).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
              :"" || ""}
          </div>
        )}
      </div>
    );
  }
}

export default Form.createForm()(NumberEditCell);