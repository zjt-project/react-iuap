import React, { Component } from 'react';
import {InputNumber} from 'tinper-bee';
import { TableFormRef  } from './TableFormRef';

import './index.less';

class FormInputNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    static defaultProps = {
        disabled: true,
        toThousands:false,
        precision:0,
        toPercent:false,

    }
    static propTypes = {
        disabled: PropTypes.bool,
        precision:PropTypes.number,
        toThousands:PropTypes.bool,
        toPercent:PropTypes.bool,
    }

    render() {
        let _props = this.props;
        let _inputProps = {...this.defaultProps,..._props};
        let {disabled,toThousands,toPercent,precision,...otherProps} = _inputProps;
        //console.log('进入FormInputNumber');
        return (
            <InputNumber
                disabled={disabled}
                toThousands={toThousands}
                precision={precision}
                toPercent={toPercent}
                {...otherProps}
            />

        );
    }
}

export default FormInputNumber;
