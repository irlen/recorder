import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import Scrollbars from 'react-custom-scrollbars'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const { TabPane } = Tabs
function Content (props){
  const [ visible, setVisible ] = useState(false)
  const [ windowH, setWindowH] = useState(0)
  const [ _isMounted,set_isMounted] = useState(true)
  const [ textValue, setTextValue ] = useState("")
  const [ activeKey, setActiveKey ] = useState()

  const [panes,setPanes] = useState([
    { title: 'Tab 1', content: 'Content of Tab Pane 1', key: '1'},
    { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
  ])
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
  
  const handleChange = (value)=>{
    setTextValue(value)
  }
  const tabsChange = (activeKey)=>{
    setActiveKey(activeKey)
  }
  return (
      <div>
          <Tabs
            size={"small"}
            tabBarGutter={0}
            type="editable-card"
            tabBarStyle={{
              height:"20px"
            }}
            onChange={tabsChange}
          >
            {panes.map(pane => (
              <TabPane 
                tab={pane.title} 
                key={pane.key}
              >
                <div style={{paddingLeft:"20px"}}>
                  
                  <Scrollbars style={{ "width": "100%", "height": windowH - 80 + "px" }}>
                    <SimpleMDE
                      id="your-custom-id"
                      label=""
                      onChange={handleChange}
                      value={textValue}
                      options={{
                        autofocus: true,
                        spellChecker: false
                        // etc.
                      }}
                    />
                  </Scrollbars>
                </div>
              </TabPane>
            ))}
          </Tabs>
      </div>
  )
}


  const mapStateToProps = (state)=>({
    windowH: state.windowH.windowH
  })
  export default connect(mapStateToProps,null)(Content)