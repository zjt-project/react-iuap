import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from "tinper-bee/lib/Datepicker";

class TimeModel extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }


    render() {
        let {text,record,index,dateFormatTime} = this.props;
        return (
            <div>
                {record._edit ?<div className = "time_model">
                <DatePicker
                    format={dateFormatTime}
                    defaultValue={moment()}
                    showTime="true"
                    placeholder="选择时间..."
                    /></div> : <div>{text ? moment(text).format(dateFormatTime) : ""}</div>}
            </div>
            
        );
    }
}

export default TimeModel;