import PropTypes from 'prop-types';
import moment from 'moment';
import {Tooltip} from "tinper-bee";
import EnumModel from 'components/GridCompnent/EnumModel';
import {deepClone, Info} from "utils";
import {enumConstantValue} from "utils/enums";
const TYPE_STRING = '0';
const TYPE_NUMBER = '1';
const TYPE_PERCENT = '2';
const TYPE_DATE = '3';
const TYPE_TIME = '4';
const TYPE_REF = '5';
const TYPE_ENUM = '6';
const TYPE_CURRENCY = '7';

const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
/**
 * 生成业务单据列表
 * @param {数组参数:界面列表字段描述} param
 * 0:字符串,1:数字,2:百分数,3:日期,4:日期时间,5:参照,6:下拉,7:金额
 *
 */
export function genGridColumn(param){
    let gridColumn = param.map(function(element,index,param){
        let{type,title,key,width,digit,enumType,ifshow,sorter} = element;
        if(ifshow == null) ifshow = true; //ifshow:false 不显示该列  默认显示
        if(width == null) width = 120;
        if(digit == null) digit = 0;
        if(sorter == null) sorter = 1;   //默认1 排序   0不排序

        switch(type){
            case TYPE_STRING :
                if(sorter == 1){
                    return {
                        title:title,
                        dataIndex:key,
                        key:key,
                        ifshow:ifshow,
                        width: width,
                        type: 'string',
                        sorter: (pre, after) => {
                            if(pre[key].length > after[key].length){
                                return 1;
                            } else {
                                return pre[key].toString().localeCompare(after[key].toString(),'zh-CN')
                            }
                        },
                        render: (text, record, index) => {
                            return(<Tooltip inverse placement="top" overlay={text}>
                                    <span tootip={text}>{text}</span>
                                </Tooltip>)
                        }
                    };
                }else{
                    return {
                        title:title,
                        dataIndex:key,
                        key:key,
                        ifshow:ifshow,
                        width: width,
                        type: 'string',
                        render: (text, record, index) => {
                            return(<Tooltip inverse placement="top" overlay={text}>
                                    <span tootip={text}>{text}</span>
                                </Tooltip>)
                        }
                    };
                }
            case TYPE_NUMBER :
                if(sorter == 0){
                    return {
                        title:title,
                        dataIndex:key,
                        ifshow:ifshow,
                        key:key,
                        type: 'number',
                        width: width,
                        render: (text, record, index) => {
                            return (<span style={{'float':'right'}}>{(typeof text)==='number'? text.toFixed(digit):""}</span>)
                        }
                    };
                }else{
                    return {
                        title:title,
                        dataIndex:key,
                        ifshow:ifshow,
                        key:key,
                        width: width,
                        type: 'number',
                        sorter: (pre, after) => {return pre[key] - after[key]},
                        render: (text, record, index) => {
                            return (<span style={{'float':'right'}}>{(typeof text)==='number'? text.toFixed(digit):""}</span>)
                        }
                    };
                }
            case TYPE_PERCENT :
                return {
                    title:title,
                    dataIndex:key,
                    key:key,
                    ifshow:ifshow,
                    width: width,
                    type: 'percent',
                    sorter: (pre, after) => {return pre[key] - after[key]},
                    className:'column-number-right',
                    render: (text, record, index) => {
                        return (<span style={{'float':'right'}}>{(typeof text)==='number'? (text * 100).toFixed(digit).toString + '%':""}</span>)
                    }
                };
            case TYPE_DATE :
                return {
                    title: title,
                    dataIndex: key,
                    key: key,
                    ifshow:ifshow,
                    width: width,
                    type: 'date',
                    sorter: (pre, after) => {return new Date(pre[key]).getTime() - new Date(after[key]).getTime()},
                    render: (text, record, index) => {
                        return <div>{text ? moment(text).format(dateFormat) : ""}</div>

                    }
                };
            case TYPE_TIME :
                return {
                    title: title,
                    dataIndex: key,
                    key: key,
                    ifshow:ifshow,
                    width: width,
                    type: 'time',
                    sorter: (pre, after) => {return new Date(pre[key]).getTime() - new Date(after[key]).getTime()},
                    render: (text, record, index) => {
                        return <div>{text ? moment(text).format(dateTimeFormat) : ""}</div>

                    }
                };
            case TYPE_REF :
                return {
                    title: title,
                    dataIndex: key,
                    key: key,
                    ifshow:ifshow,
                    width: width,
                    type: 'ref',
                    render: (text, record, index) => {
                        return(<Tooltip inverse overlay={text}>
                                <span tootip={text}>{text}</span>
                            </Tooltip>)
                    }
                };
            case TYPE_ENUM :
                return {
                    title: title,
                    dataIndex: key,
                    key: key,
                    width: width,
                    ifshow:ifshow,
                    type: 'enum',
                    enumType: enumType,
                    sorter: (pre, after) => {
                        if(pre[key].length > after[key].length){
                            return 1;
                        } else {
                            return pre[key].localeCompare(after[key],'zh-CN')
                        }
                    },
                    render: (text, record, index) => {
                        return (<EnumModel type={enumType} text={text} record={record} index={index}/>)
                    }
                };
            case TYPE_CURRENCY :
                return {
                    title: title,
                    dataIndex: key,
                    key: key,
                    ifshow:ifshow,
                    width: width,
                    type: 'currency',
                    render: (text, record, index) => {
                        return (<span style={{'float':'right'}}>{(typeof text)==='number'? text.toFixed(digit).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'):""}</span>)
                    }
            }
        }
    });
    return gridColumn;
  }


/*******************************常用业务校验函数************************************/
/**
 * 单条业务数据操作
 * @param {*} param
 * @param {*} fn
 */
export function singleRecordOper(param = [],fn =(obj) => {}){
    if(param && param.length > 0){
        if(param.length > 1){
            let msg = `您当前选中 ${param.length} 条数据,只能选择 1 条数据!`;
            Info(msg);
        } else {
            console.log(param[0]);
            fn(param[0])
        }

    } else {
        Info("您当前选中 0 条数据,请选择 1 条数据后再进行操作!");
    }
}

/**
 * 提升请选择一条数据
 * @param {*} param
 * @param {*} fn
 */
export function multiRecordOper(param = [],fn =(obj) => {}){
    if(param && param.length == 0){
        Info("您当前选中 0 条数据,请选择 1 条数据后再进行操作!");
    } else {
        fn(param)
    }
}

/**
 *
 * @param {页面对象} param
 * @param {状态权限集合} status
 */
export function checkBillStatus(param={},status=[]){
    if(status && status.length > 0){
        return status.includes(param['billstatus']);
    } else {
        return true;
    }
}

export function ExportExcel(options={}, fileName){
    var _options = {
        // fileName: options.fileName || "download",
        fileName: fileName ? fileName : "download",
        datas: options.datas,
        workbook: {
          SheetNames: [],
          Sheets: {}
        }
      };
      var instance = {
        saveExcel: function saveExcel() {
          var wb = _options.workbook;
          _options.datas.forEach(function (data, index) {
            var sheetHeader = data.sheetHeader || null;
            var sheetData = data.sheetData;
            var sheetName = data.sheetName || "sheet" + (index + 1);
            var sheetFilter = data.sheetFilter || null;
            var columnAttr = data.columnAttr || [];
            var rowAttr = data.rowAttr || [];
    
            sheetData = changeData(sheetData, sheetFilter, columnAttr);
    
            if (sheetHeader) {
              sheetData.unshift(sheetHeader);
            }
    
            var ws = sheetChangeData(sheetData);
    
            ws["!merges"] = [];
            ws["!cols"] = columnAttr;
            ws['!rows'] = rowAttr;
            // console.log("ws : ",ws);
            wb.SheetNames.push(sheetName);
            wb.Sheets[sheetName] = ws;
          });
    
          var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: false,
            type: "binary"
          });
          saveAs(new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
          }), _options.fileName + ".xlsx");
        }
      };
    
      return instance;
}

    /**
     * 过滤需要处理的字段
     * @param gridColumn 需要处理的字段 
     * @param grid 全部的字段 
     * @param show show==true gridColumn为需要显示的字段  show==false  gridColumn为隐藏的字段
     */
export function getShowColumn(gridColumn,grid,show){
    if(show){
        grid.map((item,index)=>{
            grid[index] = Object.assign(item, {ifshow:false});
        })
    }
    gridColumn.map((item,index)=>{
        grid.map((itemGrid,indexGrid)=>{
            if(item == itemGrid.key){
                const obj = Object.assign(itemGrid, {ifshow:show?true:false})
                grid[indexGrid] = obj;
            }
        })
    });
    return grid;
}

/**
 * 处理data返回数据 避免出现数据异常错误
 */
export function consoleData(result = [], param = {}, method, subname){
    let updateData = {showLoading: false};
    if(result != null && result != undefined){
        if(result.data != null && result.data != undefined){
            let data = result.data;
            if(method == "main"){     //main 处理主表加分页
                let queryObj = {
                    pageIndex:param.pageIndex,
                    pageSize:param.pageSize,
                    total:data.total,
                    totalPages:Math.ceil(data.total/param.pageSize)
                };
                updateData.queryObj = queryObj;
                updateData.queryParam = param;
                updateData.list = data.pageData;
            }else{
                if(subname != null && subname != undefined){
                    updateData.list2 = data[subname];
                }else{
                    updateData.list2 = data;
                }  
            }
        }
    }
    return updateData;
}

/**
 * 处理data返回数据 避免出现数据异常错误  因为传入分页方式不统一 此处写入第二个备用
 */
export function consoleDataByPagi(result = [], param = {}, method, subname){
    let updateData = {showLoading: false};
    if(result != null && result != undefined){
        if(result.data != null && result.data != undefined){
            let data = result.data;
            if(method == "main"){     //main 处理主表加分页
                let queryObj = {
                    pageIndex:param.pagination.pageIndex,
                    pageSize:param.pagination.pageSize,
                    total:data.total,
                    totalPages:Math.ceil(data.total/param.pagination.pageSize)
                };
                updateData.queryObj = queryObj;
                updateData.queryParam = param;
                updateData.list = data.pageData;
            }else{
                updateData.list2 = data[subname];
            }
        }
    }
    return updateData;
}

/**
 * 获取参照对象中的属性
 * @param {对象} formObject 
 * @param {字段值} value 
 */
var getRefValue = (formObject,value) =>{
    if(value.indexOf('.')>0){
        let field = value.substr(value.indexOf('.')+1);
        value = value.substring(0,value.indexOf("."));
        formObject = formObject[value];
        return formObject ? getRefValue(formObject,field): null;
    }
    return formObject[value] ? formObject[value] :"";
}

/**
 * josn导出excel
 */
var changeData = function changeData(data, filter, column) {
    var sj = data,   //对象导出数组
        f = filter,  //对应对象导出字段列
        na = column, //每个字段对应的属性  对应转化关系(转换枚举与参照使用)
        re = [];
    Array.isArray(data) ? function () {
      //对象
      f ? function () {
        //存在过滤
        sj.forEach(function (obj) {
          var one = [];
          for(var i =0 ; i<filter.length; i++){
             if(column[i].type == 'enum'){
                let data = enumConstantValue(column[i].enumtype, obj[filter[i]])
                one.push(data);
             }else if(column[i].type == 'ref'){
                let data = getRefValue(obj, filter[i]);
                one.push(data);
             }else if(column[i].type == 'number'){
                let data = obj[filter[i]] ? obj[filter[i]].toFixed(column[i].digit) :"";
                one.push(data);
             }else if(column[i].type == 'percent'){
                let data = obj[filter[i]] ? (obj[filter[i]] * 100).toFixed(column[i].digit).toString + '%' : "";
                one.push(data);
             }else if(column[i].type == 'currency'){
                let data = obj[filter[i]] ? obj[filter[i]].toFixed(column[i].digit).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'):"";
                one.push(data);
             }else{
                one.push(obj[filter[i]] ? obj[filter[i]] : "");
             }
          }
          re.push(one);
        });
      }() : function () {
        //不存在过滤
        sj.forEach(function (obj) {
          var col = Object.keys(obj);
          var one = [];
          col.forEach(function (no) {
            one.push(obj[no]);
          });
          re.push(one);
        });
      }();
    }() : function () {
      re = sj;
    }();
    return re;
  };
  var s2ab = function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }return buf;
  };
  // 转换数据
var sheetChangeData = function sheetChangeData(data) {
    var ws = {};
    var range = {
      s: {
        c: 10000000,
        r: 10000000
      },
      e: {
        c: 0,
        r: 0
      }
    };
    for (var R = 0; R != data.length; ++R) {
      for (var C = 0; C != data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R;
        if (range.s.c > C) range.s.c = C;
        if (range.e.r < R) range.e.r = R;
        if (range.e.c < C) range.e.c = C;
        var cell = {
          v: data[R][C]
        };
        if (cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({
          c: C,
          r: R
        });
  
        if (typeof cell.v === "number") cell.t = "n";else if (typeof cell.v === "boolean") cell.t = "b";else if (cell.v instanceof Date) {
          cell.t = "n";
          cell.z = XLSX.SSF._table[14];
          cell.v = datenum(cell.v);
        } else cell.t = "s";
        ws[cell_ref] = cell;
      }
    }
    if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
    return ws;
  };
