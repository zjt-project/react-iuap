import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import mirror, { connect,actions } from 'mirrorx';
import Drawer from 'ac-drawer';
import "ac-drawer/dist/ac-drawer.css";
import {getCookie} from "utils";
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
class TopSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dddd: 1
    }
  }
  handleClick(e) {
    this.props.sideBarOper.handleClick(e);
  }
  changeAhref(item) {
    this.props.sideBarOper.changeAhref(item);
  }
  openTab(e,reload,item) {
    this.props.sideBarOper.openTab(e,reload,item);
  }
  formmaterUrl(item) {
    return window.formmaterUrl(item);
  }
  collectefunc(e,itit,index1,index2,index3) {
    this.props.sideBarOper.collectefunc(e,itit,index1,index2,index3);
  }
  handleDefault(e,isDefault) {
    this.props.sideBarOper.handleDefault(e,isDefault)
  }
  clickFun(e,item,menulist,index1) {
    this.setState({
        dddd: index1
    })
  }
   render() {
    let {sideBarShow,menu} = this.props;
    let self = this;
    let dddd = this.state.dddd;
    let locale_serial = getCookie("locale_serial");
    if(locale_serial == 1) {
        locale_serial = "";
    }
    return (
      <div>
      <Drawer className={'demo2'} hasHeader={false} show={sideBarShow} placement="left">
          <div className="left-side-bar">
          <div className="left-side-bar-menu">
              {
                  menu.map(function (item,index1) {
                    //   let blank = item.openview=="newpage"&&item.urltype=='url'?"_blank":"";
                      let blank = "";    //默认不在新页面打开  只新增一个页签
                      var noSecond = 'only-second-menu';
                      if(Array.isArray(item.children)&&item.children.length>0){
                          let list = [];
                          var menulist = [[],[]];
                          var pages = 0;

                          let title = (<a href="javascript:;" data-ahref={self.changeAhref(item)}  key={item.pkFuncmenu} className={index1===dddd?'sidebar-select-active first-child':'first-child'} name={item['funcName'+locale_serial]} data-licenseControlFlag ={0} data-areaId ={null}><i className={'icon '+item.icon}></i><span className={index1===dddd?'sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['funcName'+locale_serial]}</span></a>);
                          item.children.map(function(it,index2){

                            //   let blank =it.openview=="newpage"&&it.urltype=='url'?"_blank":"";
                              let blank = "";
                              if(Array.isArray(it.children)&&it.children.length>0){
                                  let list2 = [];
                                  let searchlist =[];
                                  let title = (<a href="javascript:;" data-ahref={self.changeAhref(it)} key={it.pkFuncmenu} className="child-title" data-areaId={null} data-licenseControlFlag={0}><i className={'icon-child'}></i><span title={it['funcName'+locale_serial]}>{it['funcName'+locale_serial]}</span></a>);
                                  noSecond = 'no-second-menu';
                                  it.children.map(function(itit,index3){
                                    //   let blank =itit.openview=="newpage"&&itit.urltype=='url'?"_blank":"";
                                      let blank = "";
                                      let html = <li key={itit.pkFuncmenu+"m"}><a target={blank} value={itit.pkFuncmenu}
                                                        data-areaId={itit.pkFuncmenu}
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
                                  var  cellH = 46;
                                  let  html = <div className={'menu-popup menu-popup-one'}>
                                      <a target={blank} value={it.pkFuncmenu} data-areaId ={it.pkFuncmenu} data-ahref ={self.changeAhref(it)} data-licenseControlFlag={0} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,'',it)}} ref={it.pkFuncmenu} name={it['funcName'+locale_serial]} href={self.formmaterUrl(it)}>{it['funcName'+locale_serial]}<i className={ it.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                                                                                                                                                                                                                 onClick={(e) =>{e.preventDefault();self.collectefunc(e,it,index1,index2)} }
                                                                                                                                                                                                                                                                                                 data-menuId={it.pkFuncmenu} title={'收藏'}></i></a>
                                  </div>
                                  menulist[0].push(html)



                              }

                          });

                          return (
                              /* 此处要考虑原有的submenu的逻辑 */
                              <div onClick={(e)=>self.clickFun(e,item,menulist,index1)} className="side-bar-first">
                                  {title}
                              </div>
                          )
                      }
                      else {
                            let blank ="";

                            if(item.pkFuncmenu.trim() == 'index'){
                                return false;
                            }

                          let title = (
                              <a target={blank} key={item.pkFuncmenu} value={item.pkFuncmenu} className="first-child" data-areaId={item.pkFuncmenu} data-ahref={self.changeAhref(item)} data-licenseControlFlag ={0} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,'',item)}} ref={item.pkFuncmenu} href={self.formmaterUrl(item)} name={item['funcName'+locale_serial]}><i className={'icon '+item.icon}></i><span ><label className="uf uf-triangle-left"></label>{item['funcName'+locale_serial]}</span></a>
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
          <div className="sidebar-content-sub">
                  {
                      menu.map(function (item,index1) {
                          if(index1 === dddd){
                           let blank ="";
                           var noSecond = 'only-second-menu';

                          if(Array.isArray(item.children)&&item.children.length>0){
                              let list = [];
                              var menulist = [[],[]];

                              var pages = 0;

                              let title = (<a href="javascript:;" data-ahref={self.changeAhref(item)}  key={item.pkFuncmenu} className="first-child" name={item['funcName'+locale_serial]} data-licenseControlFlag ={0} data-areaId ={null}><i className={'icon '+item.icon}></i><span className={item.pkFuncmenu===item.pkFuncmenu?'sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['funcName'+locale_serial]}</span></a>);
                              item.children.map(function(it,index2){

                                  let blank = "";
                                  if(Array.isArray(it.children)&&it.children.length>0){
                                      let list2 = [];
                                      let searchlist =[];
                                      let title = (<a href="javascript:;" data-ahref={self.changeAhref(it)} key={it.pkFuncmenu} className="child-title" data-areaId={it.pkFuncmenu} data-licenseControlFlag={0}><i className={'icon-child'}></i><span title={it['funcName'+locale_serial]}>{it['funcName'+locale_serial]}</span></a>);
                                      noSecond = 'no-second-menu';
                                      it.children.map(function(itit,index3){
                                          let blank = "";
                                          let html = <li key={itit.pkFuncmenu+"m"}><a target={blank} value={itit.pkFuncmenu}
                                                            data-areaId={itit.pkFuncmenu}
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
                                      // }
                                  } else {
                                      let  html = <div className={'menu-popup menu-popup-one'}>
                                          <a target={blank} value={it.pkFuncmenu} data-areaId ={it.pkFuncmenu}
                                             data-ahref ={self.changeAhref(it)} data-licenseControlFlag={0}
                                             onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,'',it)}} ref={it.pkFuncmenu} name={it['funcName'+locale_serial]}
                                             href={self.formmaterUrl(it)}>{it['funcName'+locale_serial]}
                                             <i className={ it.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                onClick={(e) =>{e.preventDefault();self.collectefunc(e,it,index1,index2)} } data-menuId={it.pkFuncmenu} title={'收藏'}>
                                             </i></a>
                                      </div>
                                      menulist[0].push(html)
                                  }

                              });
                             return  menulist.map(function(ite,i){
                                  ite = ite.length!=0?<div className="sidebar-content-sub-menu-list" >{ite}</div>:ite;
                                  return (
                                      ite
                                  )
                              })
                          }
                          }

                      })
                  }
          </div>
          </div>
          </Drawer>
      </div>
    )
  }
}
export default TopSideBar;
