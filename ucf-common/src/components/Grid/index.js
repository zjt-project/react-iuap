import React, {Component} from "react";
import Grid from "bee-complex-grid";
// import { Table,Checkbox,Icon,Popover } from 'tinper-bee';
// import BigData from "bee-table/build/lib/bigData";
// import multiSelect from 'bee-table/build/lib/multiSelect';
// import filterColumn from 'bee-table/build/lib/filterColumn';
// let  ComplexTable = filterColumn(multiSelect(BigData(Table), Checkbox), Popover, Icon);
import './index.less';
import 'bee-complex-grid/build/Grid.css';


const defualtPaginationParam = {
    dataNumSelect: ["5", "10", "15", "20", "25", "50", "All"],
    horizontalPosition: 'center',
    verticalPosition: "bottom",
    dataNum: 4,
    btnType: {
        shape: 'border'
    },
    noBorder: true,
    confirmBtn: () => null
};
const defaultProps = {
    //   hideBodyScroll: true,
    headerScroll: false,
    bordered: false,
    data: []
};

class BaseGrid extends Component {
    constructor(props) {
        super(props);
    }

    /**
     *获取保存的column和table上的属性
     *
     */
    getColumnsAndTablePros = () => {
        return this.grid.getColumnsAndTablePros();
    };
    /**
     *
     * 重置grid的columns
     */
    resetColumns = newColumns => {
        this.grid.resetColumns(newColumns);
    };


    render() {
        const { paginationObj, data, exportData,  ...otherProps } = this.props;
        const _paginationObj = {...defualtPaginationParam, ...paginationObj};
        _paginationObj.disabled = paginationObj.disabled !== undefined
            ? paginationObj.disabled
            : data.length === 0;
        return (
            <div className='demo-grid-wrapper'>
                <Grid
                    className="ucf-example-grid"
                    data={data}
                    {...otherProps}
                    paginationObj={_paginationObj}
                    ref={el => this.grid = el}
                />
            </div>
        );
    }
}

Grid.defaultProps = defaultProps;
export default BaseGrid;
