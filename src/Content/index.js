import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

function Content (props){
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
      <div>
          右边内容
      </div>
  )
  
}


  const mapStateToProps = (state)=>({
    windowH: state.windowH.windowH
  })
  export default connect(mapStateToProps,null)(Content)