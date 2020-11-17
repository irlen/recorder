import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import Scrollbars from 'react-custom-scrollbars'
import { Tree, Button, Modal, Input, message } from 'antd';
import { v4 } from 'uuid'
import _ from 'lodash'
import useContextMenu from '../hooks/useContextMenu'

import { wyAxiosPost } from '../utils/wyAxios'

const { DirectoryTree } = Tree;

const data = [
    {
        title: 'parent 0',
        key: '0-0',
        isLeaf: false,
        children: [
            {
                title: 'parent 0',
                key: 's-0',
                isLeaf: false,
                children: [
                    {
                        title: 'leaf s-0',
                        key: '0-s-0',
                        isLeaf: true,
                    },
                    {
                        title: 'leaf s-1',
                        key: '0-s-1',
                        isLeaf: true,
                    },
                ]
            },
            {
                title: 'leaf 0-0',
                key: '0-0-0',
                isLeaf: true,
            },
            {
                title: 'leaf 0-1',
                key: '0-0-1',
                isLeaf: true,
            },
        ],
    },
    {
        title: 'parent1',
        key: '0-1',
        isLeaf: false,
        children: [
            {
                title: 'leaf1-0',
                key: '0-1-0',
                isLeaf: true,
            },
            {
                title: 'leaf1-1',
                key: '0-1-1',
                isLeaf: true,
            },
        ],
    },
];
function Nav(props) {
    const [treeData, setTreeData] = useState(data)
    const [visible, setVisible] = useState(false)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [windowH, setWindowH] = useState(0)
    const [_isMounted, set_isMounted] = useState(true)
    const [curEdit, setCurEdit] = useState(null) //右键编辑文件的信息
    const [selectedKeys, setSelectedKeys] = useState(["0-s-1"])
    const [expandedKeys, setExpandedKeys] = useState([])
    const [curName, setCurName] = useState("") //当前操作的文件的名字
    const [addType, setAddType] = useState(null)
    const [deleteType, setDeleteType] = useState(null)


    const treeRef = useRef()
    //treeRef.current.scrollTo({ key: "0-0-0-5-4" });//虚拟滚动到指定位置
    const folderContextMenu = [
        {
            label: "新建文件",
            click: () => { preAdd({ isLeaf: true }) }
        }, {
            label: "新建文件夹",
            click: () => { preAdd({ isLeaf: false }) }
        }, {
            label: "删除",
            click: () => { preDelete({ isLeaf: false }) }
        }
    ]
    const fileContextMenu = [
        {
            label: "删除",
            click: () => { preDelete({ isLeaf: true }) }
        }
    ]
    useEffect(() => {
        if (props.windowH) {
            setWindowH(props.windowH)
        }
        return () => {
            set_isMounted(false)
        }
    }, [])
    const enterEvent = function (e) {
        let event = e || event
        if (event.keyCode !== 13) {
            return
        }
        if (visible) {
            doAdd()
        }
        if(deleteVisible){
            doDelete()
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', enterEvent)
        return () => { window.removeEventListener("keydown", enterEvent) }
    })

    useEffect(() => {
        if (props.windowH && _isMounted) {
            setWindowH(props.windowH)
        }
    }, [props.windowH])
    useEffect(() => {
        if (addType) {
            showModal()
        }
        if(deleteType){
            deleteShowModal()
        }
    }, [addType,deleteType])
    //右键事件
    useContextMenu({ folder: folderContextMenu, file: fileContextMenu }, curEdit)
    const showContext = (event, node) => {
        setCurEdit(node)
    }

    const onSelect = (keys, event) => {
        setSelectedKeys(keys)
    };
    const onExpand = (keys, node) => {
        setExpandedKeys(keys)
    };
    const handleCancel = () => {
        setCurEdit(null)
        setCurName(null)
        setAddType(null)
        setVisible(false)
    }
    const deleteHandleCancel = ()=>{
        setCurEdit(null)
        setCurName(null)
        setDeleteType(null)
        setDeleteVisible(false)
    }
    const handleOk = () => {
        doAdd()
    }
    const deleteHandleOk = ()=>{
        doDelete()
    }
    const showModal = () => {
        setVisible(true)
    }
    const deleteShowModal = ()=>{
        setDeleteVisible(true)
    }
    //新增文件夹或者文件
    const preAdd = (type) => {
        const { isLeaf } = type
        if (isLeaf) {
            setAddType("file")
        } else {
            setAddType("folder")
        }
    }
    const preDelete = (type) => {
        const { isLeaf } = type
        if (isLeaf) {
            setDeleteType("file")
        } else {
            setDeleteType("folder")
        }
    }
    //检验同级重名
    const isExist = (comonPath)=>{
        return new Promise((resolve,reject)=>{
            wyAxiosPost('nav/isexist',{comonPath:comonPath},(result)=>{
                console.log(result)
            })
        })
    }
    //新增
    const doAdd = async() => {
        if (!curName) {
            message.warning("请输入名称")
            return
        }
        const reg = /\.\w+$/;
        const file_type = curName.match(reg)
        if (addType === "file") {
            if (!file_type) {
                message.warning("请添加文件后缀")
                return
            } else if (file_type[0] !== ".md") {
                message.warning("目前只支持后缀为.md的文件")
                return
            }
        }
        //加到treeData里面
        const newId = v4()
        let newTreeData = []
        let newFile = {}
        const { key } = curEdit
        if (curEdit) {
            //文件夹内新增
            const curTreeData = _.cloneDeep(treeData)
            let filePath = []
            const doInsert = (arr, key,apath) => {
                const initFilePath = _.cloneDeep(apath)
                for (let atom of arr) {
                    const curFilePath = _.cloneDeep(initFilePath)
                    curFilePath.push(atom.title)
                    if (atom.key === key) {
                        //todo 比较同意文件夹内的文件是否有重名
                        curFilePath.push(curName)
                        if(!atom.children){
                            atom.children = []
                        }
                        
                        const new_file = {
                            title: curName,
                            key: newId,
                            isLeaf: addType === "file" ? true : false,
                            path: _.cloneDeep(curFilePath).join("/")
                        }
                        newFile = _.cloneDeep(new_file)
                        atom.children.push(new_file)
                        filePath = curFilePath
                        return
                    }else{
                        if (atom.children && atom.children.length > 0) {
                            doInsert(atom.children, key,curFilePath)
                        }
                    }
                }
            }
            doInsert(curTreeData, key,[])
            //通过filePath查是否有同名的
            const filePathArr = _.cloneDeep(filePath)
            const comonPath = filePathArr.join("/")
            //查询数据库中同级别文件下是否有同名文件
            isExist(comonPath)


        

 
            





            newTreeData = _.cloneDeep(curTreeData)
        } else {
            //最外层新增
            //todo同层名称去重
            const new_file = {
                title: curName,
                key: newId,
                isLeaf: addType === "file" ? true : false,
                path: curName
            }
            newFile = _.cloneDeep(new_file)
            const newData = [...treeData, new_file]
            newTreeData = _.cloneDeep(newData)
        }
        //todo存数据库
        wyAxiosPost('nav/save',{treeData:newTreeData,fileData: newFile},(result)=>{
            const {code,msg} = result
            if(code === 0){
                message.warning(msg)
                return
            }
            setTreeData(newTreeData)
            if(key){
                setExpandedKeys([...expandedKeys, key])
            }
            if(addType === "file"){
                setSelectedKeys([newId])
                //todo如果是文件，需要在右边选中并显示出来
            }
            handleCancel()
        })
    }
    //删除
    const doDelete = () => {
        const { isLeaf, key } = curEdit
        const curTreeData = _.cloneDeep(treeData)
        if(isLeaf){
            //删除对象为文件时
            const doRe = (arr, key) => {
                for (let index in arr) {
                    if (arr[index].key === key) {
                        arr.splice(index,1)
                        //todo 数据库中和文件夹里面要删除这项
                        setTreeData(curTreeData)
                        deleteHandleCancel()
                        return
                    }else if(arr[index]["children"] && arr[index]["children"].length>0){
                        doRe(arr[index]["children"],key)
                    }
                }
            }
            doRe(curTreeData,key)
        }else{
            //删除的为文件夹时
            const doInRe = (arr,index)=>{
                if(!arr[index]["children"] || (arr[index]["children"] && arr[index]["children"].length===0)){
                    //todo数据库和文件要做删除(子文件夹为空文件夹或者文件)
                    return
                }else{
                    const atomArr = arr[index]["children"]
                    for(let atomIndex in atomArr){
                        doInRe(atomArr,atomIndex)
                    }
                }
            }
            const doRe = (arr, key) => {
                for (let index in arr) {
                    if (arr[index].key === key) {
                        doInRe(arr, index)
                        arr.splice(index,1)
                    }else if(arr[index]["children"] && arr[index]["children"].length>0){
                        doRe(arr[index]["children"],key)
                    } 
                }
                setTreeData(curTreeData)
                deleteHandleCancel()
            }
            doRe(curTreeData,key)
        }
    }

    return (
        <div style={{ background: "#f9f9f9", position: "relative",borderRight:"1px solid #f0f0f0"}}>
            <Scrollbars style={{ "width": "100%", "height": windowH - 20 + "px" }}>
                <DirectoryTree
                    ref={treeRef}
                    selectedKeys={selectedKeys}
                    expandedKeys={expandedKeys.length > 0 ? expandedKeys : selectedKeys}
                    onSelect={onSelect}
                    onExpand={onExpand}
                    treeData={treeData}
                    onRightClick={({ event, node }) => { showContext(event, node) }}
                />
            </Scrollbars>
            <div style={{ position: "absolute", bottom: "0px" }}>
                <Button onClick={() => { preAdd({ isLeaf: false }) }}>添加文件夹</Button>
                <Button onClick={() => { preAdd({ isLeaf: true }) }}>添加文件</Button>
            </div>
            <Modal
                title="名称"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    名称： <Input style={{width:"80%"}} autoFocus value={curName} onChange={(e) => { setCurName(e.target.value) }} />
                </div>
            </Modal>
            <Modal
                title="删除"
                visible={deleteVisible}
                onOk={deleteHandleOk}
                onCancel={deleteHandleCancel}
            >
                <div>
                    确定要删除文件吗？
                </div>
            </Modal>
        </div>
    )
}


const mapStateToProps = (state) => ({
    windowH: state.windowH.windowH
})
export default connect(mapStateToProps, null)(Nav)