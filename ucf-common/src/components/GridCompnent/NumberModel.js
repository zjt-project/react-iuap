import React, { Component } from 'react';
import './index.less';
import {FormControl} from "tinper-bee";


class NumberModel extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }


    render() {
        let {text,record,index,digit} = this.props;
        return (
            <div >
                {record._edit ?<div className="number_model">
                <FormControl
                    type="number"
                    placeholder="请输入..."
                    /></div> : <div>{(typeof text)==='number' ? text.toFixed(digit) : "0.00"}</div>}
            </div>
            
        );
    }
}

export default NumberModel;