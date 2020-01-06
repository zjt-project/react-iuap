/**
 * 下拉框
 */
import React, { Component } from "react";
import {  } from 'tinper-bee';
import { Icon, Select, Tooltip, Form } from "tinper-bee";
import DatePicker from "tinper-bee/lib/Datepicker";
import moment from 'moment'

class DatePickerEditCell extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: false
    };
    //this.DatePicker = React.createRef();
  }

  handleChange = value => {
    this.setState({ value });
    let date = null;
    if(value != undefined && value != null && value !=""){
      date = moment(value).format("YYYY-MM-DD");
    }
    this.props.onChange(date);
  };

  // onChange = () => {
  //   if (this.props.onChange) {
  //     this.props.onChange("");
  //   }
  // };

  edit = () => {
    if(this.props.editable){
      this.setState({ editable: true });
    }
  };


  render() {
    const { value, editable} = this.state;
    const {format} = this.props;
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="editable-cell-input-wrapper" >
            <DatePicker
              defaultValue={value}
              value={value}
              format = {format?format:"YYYY-MM-DD"}
              //onChange={this.onChange}
              onSelect={this.handleChange}
              showToday={false}
              autoFocus
            >
            </DatePicker>
          </div>
        ) : (
          <div className="editable-cell-text-wrapper" onDoubleClick={this.edit.bind(this)}>
            {this.props.value || ""}
          </div>
        )}
      </div>
    );
  }
}

export default Form.createForm()(DatePickerEditCell);