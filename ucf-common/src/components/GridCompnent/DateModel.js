import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from "tinper-bee/lib/Datepicker";
import './index.less';
class DateModel extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    handleChange = (dataIndex,dateFormat,value)=>{
        this.props.record[dataIndex] = moment(value).format(dateFormat);
    }


    render() {
        let {text,record,index,dateFormat,dataIndex} = this.props;
        return (
            <div>
                {record._edit ?<div className = "date_model">
                <DatePicker
                    format={dateFormat}
                    value={text == 'Invalid date'?"":text}
                    showClose={false}
                    placeholder="选择日期..."
                    onSelect={this.handleChange.bind(this,dataIndex,dateFormat)}
                    /></div> : <div>{text ? moment(text).format(dateFormat) : ""}</div>}
            </div>
            
        );
    }
}

export default DateModel;