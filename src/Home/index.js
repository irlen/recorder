import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Nav from '../Nav'
import Content from '../Content'

function Home (props){
  const [ visible, setVisible ] = useState(false)
  const [ windowH, setWindowH] = useState(0)
  const [ _isMounted,set_isMounted] = useState(true)
  useEffect(()=>{
    if(props.windowH){
      setWindowH(props.windowH)
    }
    return ()=>{set_isMounted(false)}
  },[])

  useEffect(()=>{
    if(props.windowH && _isMounted){
      setWindowH(props.windowH)
    }
  },[props.windowH])

  return (
    <div style={{padding:"10px 20px 10px 20px"}}>
      <div style={{width:"100%",height:"autop",display:"flex"}}>
        <div style={{flex:"0 0  200px"}}>
          <Nav />
        </div>
        <div style={{flex:"1 1 auto"}}>
          <Content />
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(Home)
