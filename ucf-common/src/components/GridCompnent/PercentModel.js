import React, { Component } from 'react';
import './index.less';
import {FormControl} from "tinper-bee";


class PercentModel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onchange = (text) => {
        let digit =2;
        this.setState({
            value: (text * 100).toFixed(digit).toString() + '%'
        });
      }

    render() {
        let {text,record,index,digit} = this.props;
        return (
            <div >
                {record._edit ?<div className="percent_model">
                <FormControl
                    type="number"
                    placeholder="请输入..."
                    /></div> :<div>{(typeof text)==='number'? (text * 100).toFixed(digit).toString() + '%':""}</div>}
            </div>
            
        );
    }
}

export default PercentModel;