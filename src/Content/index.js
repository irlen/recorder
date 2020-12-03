import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Tabs,Modal,message } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { MinusCircleFilled, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import _ from 'lodash'

import { wyAxiosPost } from '../utils/wyAxios'
import { setActiveKey } from '../redux/actions'

const { confirm } = Modal
const { TabPane } = Tabs
function Content (props){
  const [ visible, setVisible ] = useState(false)
  const [ windowH, setWindowH] = useState(0)
  const [ _isMounted,set_isMounted] = useState(true)
  const [ activeKey, setActiveKey ] = useState(null)

  //2种状态，1.已经保存；2.修改了未保存；
  const [panes,setPanes] = useState(null)
  useEffect(()=>{
    if(props.windowH){
      setWindowH(props.windowH)
    }
    
    if(localStorage["panesData"]){
      const historyPanesData = JSON.parse(localStorage["panesData"])
      if(historyPanesData.length>0){
        setPanes(historyPanesData)
        setActiveKey(historyPanesData[0]["key"])
        props.setActiveKey(historyPanesData[0]["key"])
      }
    }
    return ()=>{
      set_isMounted(false)
    }
  },[])
  const saveCotent = (e)=>{
    if((e.key=='s'||e.key=='S')&&(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
      e.preventDefault();
      if(!activeKey){
        return
      }
      const curPaneIndex = _.findIndex(panes,o=>{
        return o.key === activeKey
      })
      if(curPaneIndex === -1){
        return
      }
      const curPanes = _.cloneDeep(panes)
      const curPane = curPanes[curPaneIndex]
      const value = curPanes[curPaneIndex].content
      //存value到文件中，并且将这个状态置为saved
      wyAxiosPost('content/save_content',{file_path: curPane["file_path"],content: value},(result)=>{
        const { code, msg } = result
        if(code ===1 ){
          curPanes[curPaneIndex]["status"] = "saved"
          setPanes(curPanes)
          localStorage.setItem("panesData",JSON.stringify(curPanes))
        }else{
          message.warning(msg)
        }
      })
    }
  }
  
  useEffect(()=>{
    if(props.activeKey && props.activeKey !== activeKey){
      const isExist = is_pane_exist(props.activeKey)
      if(!isExist){
        wyAxiosPost('content/get_pane',{key:props.activeKey},(result)=>{
          const { code, data, msg } = result
          if(code === 0){
            message.warning(msg)
            return
          }
          const { content, file_name, id, file_path } = data
          const newPane = { title: file_name, content, key:id, status: "saved",file_path }
          let genPanes = []
          if(panes && panes.length>0){
            const index = _.findIndex(panes,o=>{
              return o.key === activeKey
            })
            genPanes = _.cloneDeep(panes)
            genPanes.splice(index+1,0,newPane)
          }else{
            genPanes.push(newPane)
          }
          setPanes(genPanes)
          localStorage.setItem("panesData",JSON.stringify(genPanes))
          setActiveKey(props.activeKey)
        })
      }else{
        setActiveKey(props.activeKey)
      }
    }
  },[props.activeKey])
  useEffect(()=>{
    if(props.deleteKey){
      remove(props.deleteKey)
    }
  },[props.deleteKey])
  useEffect(()=>{
    if(activeKey){
      document.addEventListener('keydown',saveCotent);
    }
    return ()=>{
      document.removeEventListener("keydown",saveCotent)
    }
  },[activeKey,JSON.stringify(panes)])
  
  useEffect(()=>{
    if(props.windowH && _isMounted){
      setWindowH(props.windowH)
    }
  },[props.windowH])
  const is_pane_exist = (key)=>{
    if(!panes){
      return false
    }
    const curPane = _.find(panes,o=>{
      return o.key === key
    })
    if(curPane){
      return true
    }else{
      return false
    }
  }
  const handleChange = (value)=>{
    const curKey = activeKey
    const curPanes = _.cloneDeep(panes)
    for(let pane of curPanes){
      if(pane.key === curKey){
        if( pane.content == value ){
          return
        }
        pane.content = value
        pane.status = "updating"
        setPanes(curPanes)
        localStorage.setItem("panesData",JSON.stringify(curPanes))
        return
      }
    }
  }
  const tabsChange = (activeKey)=>{
    setActiveKey(activeKey)
    //传给redux将导航中的activekey同步
    props.setActiveKey(activeKey)
  }
  const remove = targetKey => {
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPanes(newPanes)
    localStorage.setItem("panesData",JSON.stringify(newPanes))
    setActiveKey(newActiveKey)
    //传给redux将导航中的activekey同步
    props.setActiveKey(newActiveKey)
  };
  const onEdit = (targetKey, action) => {
    if(action === "remove"){
      const curPane = _.find(panes,o=>{
        return o.key === targetKey
      })
      console.log(curPane["status"])
      if(curPane["status"] === "saved"){
        remove(targetKey)
      }else{
        showConfirm(targetKey)
      }
    }
  }
  const showConfirm = (targetKey)=>{
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '此文件未保存，确定要关闭吗?',
      okText:"确定",
      cancelText:"取消",
      onOk() {
        remove(targetKey)
      },
      onCancel() {
        return
      },
    });
  }
  let contentValue = ""
  if(activeKey){
    const curPane = _.find(panes,o=>{
      return o.key === activeKey
    })
    if(curPane){
      contentValue = curPane.content
    }
  }
  return (
      <div>
          <Tabs
            size={"small"}
            tabBarGutter={0}
            type="editable-card"
            hideAdd
            tabBarStyle={{
              height:"20px"
            }}
            onChange={tabsChange}
            activeKey={activeKey}
            onEdit={onEdit}
          >
            {panes && panes.length>0 && panes.map(pane => (
              <TabPane 
                tab={pane.title} 
                key={pane.key}
                closeIcon={pane.status === "saved"? <span style={{color:"#cccccc"}}><CloseCircleFilled /></span> : <span style={{color:"rgba(51,204,51,0.5)"}}><MinusCircleFilled /></span>}
              >
              </TabPane>
            ))}
          </Tabs>
          <div style={{paddingLeft:"20px"}}>
            <Scrollbars style={{ "width": "100%", "height": windowH - 80 + "px" }}>
              <SimpleMDE
                id="your-custom-id"
                label=""
                onChange={handleChange}
                value={contentValue}
                options={{
                  autofocus: true,
                  spellChecker: true
                  // etc.
                }}
              />
            </Scrollbars>
          </div>
      </div>
  )
}


const mapStateToProps = (state) => ({
  windowH: state.windowH.windowH,
  activeKey: state.fileInfo.activeKey,
  deleteKey: state.fileInfo.deleteKey
})
const mapDispatchToProps = (dispatch)=>({
  setActiveKey: (activeKey)=>{dispatch(setActiveKey(activeKey))}
})
  export default connect(mapStateToProps,mapDispatchToProps)(Content)