import React, { Component } from 'react';
import './style.less';
import {Icon} from 'tinper-bee';
import { func } from 'prop-types';
import { actions } from "mirrorx";




class PositionScroll extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open:this.props.open,
      currentIndex:this.props.positionIndex,
    }
  }
  componentDidMount() {
    let _this=this;
    let {modelName}=this.props;
    return
    window.onscroll=function(){
      if(_this.props.scrollFlag){
        var curTop = document.documentElement.scrollTop || document.body.scrollTop;
        let titleList=document.querySelectorAll(".collapse-title");
        titleList.forEach((item,index)=>{
          let eleHeight=item.offsetHeight;
          if(curTop-item.offsetTop>=0){
            let num=item.getAttribute("data-index")
            num=Number(num);
            actions[modelName].updateState({positionIndex: num});
          }
        })
      }
        
    }
    
  }
  openFlag=()=>{
    this.setState({
      open:!this.state.open
    })
  }
  JumpTo=(item,index)=>{
    let {modelName}=this.props;
    if(item.flag){
      document.querySelector(item.id).scrollIntoView({block:"center"});
    }else{
      document.querySelector(".child-tab-title").scrollIntoView({block:"center"});
      this.props.callBack(item,item.text,index);
      actions[modelName].updateState({scrollFlag: false});
    }
    actions[modelName].updateState({positionIndex: index});
    
  }
  render() {
    let {scrollData,callBack,positionIndex,scrollFlag,modelName}=this.props;
    let {open}=this.state;
    let ScrollData;
    if(!scrollData||!scrollData.length){
      return
    }else{
        ScrollData=scrollData.map((province,index) => (
          <li className={`li-item ${index===positionIndex?"active":null}`} key={province.id}>
            <a id={province.id} name={province.id} onClick={this.JumpTo.bind(this,province,index)}>
              <span className="left-con">
                <span className="dian"></span>
              </span>
              <span className="text">{province.text}</span>
            </a>
        </li>
      ));
    }
    return (
      <div className="position-scroll">
            {open&&<div className="open-icon" onMouseEnter={this.openFlag}>
              <Icon type = "uf-align-right"></Icon>
            </div>}
            {
              !open&&<div className="scroll-list-content" onMouseLeave={this.openFlag}>
                <ul className="scroll-list">
                  {/* <li className={`li-item ${index===this.state.currentIndex?"active":null}`}> */}
                  {ScrollData}
                </ul>
              </div>
            }
      </div>
    )
  }
}


export default PositionScroll;
