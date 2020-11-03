/** @jsx jsx */
import { jsx, css, Global, ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react';
import { ConfigProvider  } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'react-redux'



import './App.less';
import { FrameRoute } from './router'
import { setWindowH } from './redux/actions'

function App(props) {
  const [ windowH,setWindowH ]  = useState(0);
  useEffect(()=>{
    const windowH = parseInt(document.body.clientHeight,0);
    props.setWindowH(windowH);
    window.onresize = ()=>{
      const rwindowH = parseInt(document.body.clientHeight,0);
      props.setWindowH(rwindowH);
    }
  },[])
  return (
    <div className="App">
      <ConfigProvider locale={zhCN}>
        <div>
          <FrameRoute />
        </div>
      </ConfigProvider>
    </div>
  );
}

const mapDispatchToProps = (dispatch)=>({
  setWindowH: (windowH)=>{dispatch(setWindowH(windowH))}
})


export default connect(null,mapDispatchToProps)(App);
