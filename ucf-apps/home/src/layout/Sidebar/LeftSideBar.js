import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import mirror, { connect,actions } from 'mirrorx';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import {getCookie} from "utils";
class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dddd: 1,
      leftSubShow: false
    }
  }
  handleClick(e) {
    this.props.sideBarOper.handleClick(e);
  }
  changeAhref(item) {
    this.props.sideBarOper.changeAhref(item);
  }
  openTab(e,reload,item) {
    this.setState({
      leftSubShow:false
    })
    this.props.sideBarOper.openTab(e,reload,item);
  }
  formmaterUrl(item) {
    return window.formmaterUrl(item);
  }
  leftMouseEnter(e,item,menulist,index1) {
    this.setState({
      dddd: index1,
      leftSubShow:true
    })
  }
  leftMouseLeave(e,item,menulist,index1) {
    this.setState({
      leftSubShow:false
    })
  }
  barLeftClick() {
    let {leftExpanded} = this.props;
    actions.app.updateState({
      leftExpanded: !leftExpanded
    })
  }
  handleDefault(e,isDefault) {
    this.props.sideBarOper.handleDefault(e,isDefault)
  }
  collectefunc(e,itit,index1,index2,index3) {
    this.props.sideBarOper.collectefunc(e,itit,index1,index2,index3);
  }
  render() {
    let {leftExpanded,themeObj,menu} = this.props;
    let {dddd,leftSubShow} = this.state;
    let self = this;
    let locale_serial = getCookie("locale_serial");
    if(locale_serial == 1) {
        locale_serial = "";
    }
    return (
      <div>
      <div className="left-side-bar sidebar-left">
      <div className={leftExpanded?"left-side-bar-header left-side-bar-header-expanded ":"left-side-bar-header"} onClick={()=> this.barLeftClick()} style={{backgroundColor:themeObj.leftSideBgColor,backgroundImage: `url(${themeObj.leftSideBgImg})`}}>
      { themeObj.leftSideTheme === 'light'?
        <img src={require(`static/images/hanbao-dark.svg`)}/>
        : <img src={require(`static/images/hanbao-light.svg`)}/>
      }
      </div>
      <div className={!leftExpanded?"left-side-bar-menu":"left-side-bar-menu left-side-bar-menu-expand"}>
          {
              menu.map(function (item,index1) {
                  // let blank = item.openview=="newpage"&&item.urltype=='url'?"_blank":"";
                  let blank = "";
                  var noSecond = 'only-second-menu';
                  if(Array.isArray(item.children)&&item.children.length>0){
                      let list = [];
                      var menulist = [[],[]];

                      let title = (<a href="javascript:;" data-ahref={self.changeAhref(item)}  key={item.pkFuncmenu} className="first-child" name={item['funcName'+locale_serial]} data-licenseControlFlag ={0} data-areaId ={null}><i className={'icon '+item.icon}></i><span className={index1===dddd?'left-sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['funcName'+locale_serial]}</span></a>);
                      item.children.map(function(it,index2){

                          let blank = "";
                          if(Array.isArray(it.children)&&it.children.length>0){
                              let list2 = [];
                              let searchlist =[];
                              let title = (<a href="javascript:;" data-ahref={self.changeAhref(it)} key={it.pkFuncmenu} className="child-title" data-areaId={null} data-licenseControlFlag={0}><i className={'icon-child'}></i><span title={it['funcName'+locale_serial]}>{it['funcName'+locale_serial]}</span></a>);
                              noSecond = 'no-second-menu';
                              it.children.map(function(itit,index3){
                                  let blank = "";
                                  let html = <li key={itit.pkFuncmenu+"m"}><a target={blank} value={itit.pkFuncmenu}
                                                    data-areaId={item.pkFuncmenu}
                                                    title={itit['funcName'+locale_serial]}
                                                    data-ahref={self.changeAhref(itit)}
                                                    data-licenseControlFlag={0}
                                                    onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,'',itit)}}
                                                    ref={itit.pkFuncmenu} name={itit['funcName'+locale_serial]}
                                                    href={self.formmaterUrl(itit)}>{itit['funcName'+locale_serial]}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                     onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                     data-menuId={itit.pkFuncmenu} title={'收藏'}></i></li>
                                  list2.push(html)
                              });
                              if( list2.length>0) {
                                  var  cellH = Math.ceil(it.children.length/3)*25+52;
                                  var html = <div className={'menu-popup'}>
                                      {title}
                                      <div className="third-menu-content">
                                          <ul className="third-menu-list">
                                              {list2}
                                          </ul>
                                      </div>
                                  </div>;

                                  menulist[0].push (html)

                              }

                          } else {
                              let  html = <div className={'menu-popup menu-popup-one'}>
                                  <a target={blank} value={it.pkFuncmenu} data-areaId ={item.pkFuncmenu}
                                     data-ahref ={self.changeAhref(it)} data-licenseControlFlag={0}
                                     onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,'',it)}} ref={it.pkFuncmenu} name={it['funcName'+locale_serial]}
                                     href={self.formmaterUrl(it)}>{it.funcName}
                                     <i className={ it.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                        onClick={(e) =>{e.preventDefault();self.collectefunc(e,it,index1,index2)} }
                                        data-menuId={it.pkFuncmenu} title={'收藏'}></i></a>
                              </div>
                              menulist[0].push(html)
                          }

                      });
                      return (
                          /* 此处要考虑原有的submenu的逻辑 */
                          <div onMouseEnter={(e)=>self.leftMouseEnter(e,item,menulist,index1)} onMouseLeave={(e)=>{self.leftMouseLeave(e,item,menulist,index1)}} className="side-bar-first">
                              {title}
                              <div className={leftSubShow && index1===dddd?"sidebar-content-sub sidebar-content-sub-show ":'sidebar-content-sub sidebar-content-sub-hide'}>
                                      {menulist.map(function(ite,i){
                                             ite = ite.length!=0?<div className="sidebar-content-sub-menu-list" >{ite}</div>:ite;
                                             return (
                                                 ite
                                             )
                                         })}
                              </div>
                          </div>
                      )
                  }
                  else {
                      let blank ="";

                      if(item.pkFuncmenu.trim() == 'index'){
                          return false;
                      }

                      let title = (
                          <a target={blank} key={item.pkFuncmenu} value={item.pkFuncmenu} className="first-child" data-areaId={item.pkFuncmenu} data-ahref={self.changeAhref(item)} data-licenseControlFlag ={0} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,'',item)}} ref={item.pkFuncmenu} href={self.formmaterUrl(item)} name={item['funcName'+locale_serial]}><i className={'icon '+item.icon}></i><span className={item.pkFuncmenu===item.pkFuncmenu?'left-sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['funcName'+locale_serial]}</span></a>
                      );
                      return (
                          <div onClick={(e)=>self.openTab(e,'',item)} className="side-bar-first">
                              {title}
                          </div>
                      )
                  }
              })
          }

      </div>


      </div>
      </div>
    )
  }
}
export default LeftSideBar;
