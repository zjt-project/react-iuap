/**
 * string
 */
import React, { Component } from "react";
import {  } from 'tinper-bee';
import { Icon, Select, Tooltip, Form } from "tinper-bee";
import {actions} from 'mirrorx';

class StringEditCell extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: false,
    };
    this.editWarp = React.createRef();
  }


  commitChange = () => {
    this.setState({ editable: false });
    if (this.state.value === "") return;
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };

  edit = () => {
    if(this.props.editable){
      this.setState({ editable: true });
    }
  };

  handleKeydown = event => {
    if (event.keyCode == 13) {
      this.commitChange();
    }
  };

  handleChange = e => {
    //if (e.target.value === "") this.editWarp.className += " verify-cell"; //加一个样式 短了点 腾出地方当错误提示
    this.setState({ value: e.target.value });

    if(this.props.type == "email"){
      let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
      if(e.target.value == "" ||!reg.test(e.target.value)){
        e.target.className = "u-form-control error";
        actions.calculatorNormalzt.updateState({error:false});
      }else{
        e.target.className = "u-form-control";
        actions.calculatorNormalzt.updateState({error:true});
      }
    }
  };

  render() {
    const { value, editable } = this.state;
    //const {  } = this.props;
    //const { getFieldProps, getFieldError } = this.props.form;
    return (
      
      <div className="editable-cell">
        {editable ? (
          <div ref={el => this.editWarp = el} className="editable-cell-input-wrapper">
            <input
              //className={value ? "u-form-control" : "u-form-control error"}
              className={"u-form-control"}
              autoFocus
              defaultValue={this.props.value}
              value={value}
              onKeyDown={this.handleKeydown}
              onChange={this.handleChange}
              onBlur={this.commitChange}
            />
            {/* {value === "" ? (
              <Tooltip
                inverse
                className="u-editable-table-tp"
                placement="bottom"
                overlay={
                  <div className="tp-content">
                    {"请输入" + this.props.colName}
                  </div>
                }
              >
                <Icon className="uf-exc-t require" />
              </Tooltip>
            ) : null} */}
          </div>
        ) : (
          <div className="editable-cell-text-wrapper" onDoubleClick={this.edit}>
            {value || " "}
          </div>
        )}
      </div>
    );
  }
}

export default Form.createForm()(StringEditCell);