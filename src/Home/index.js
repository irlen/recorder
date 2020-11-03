import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Input }  from 'antd'

const { ipcRenderer } = window.require('electron');
function Home (props){
  const [ visible, setVisible ] = useState(false)
  const [ selPath, setSelPath ] = useState("")

  useEffect(()=>{
    console.log(props.windowH)
  },[props.windowH])

  useEffect(()=>{
    ipcRenderer.on('reply',(event,arg)=>{
      console.log(arg)
      setSelPath(arg)
    })
  },[])

  function sentMsg(message){
    ipcRenderer.send('fortest',message);
  }

  function handleOk(){
    console.log("确定")
  }

  function handleCancel(){
    setVisible(false)
  }
  return (
    <div>
      <Button type="primary" onClick={()=>{setVisible(true)}} >发送信息到主进程</Button>
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input value={selPath}/><Button onClick={()=>{sentMsg("打开对话框")}}>选择文件</Button>
      </Modal>
    </div>
  )
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(Home)
