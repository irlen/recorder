import { useEffect } from 'react'

const { remote } = window.require("electron")
const { Menu, MenuItem } = remote

const useContextMenu = (itemArr,dependence)=>{
    const menu = new Menu()
    useEffect(()=>{
        if(dependence){
            let itemList = []
            const { isLeaf } = dependence
            if(isLeaf){
                itemList = itemArr["file"]
            }else{
                itemList = itemArr["folder"]
            }
            itemList.forEach(item=>{
                menu.append(new MenuItem(item))
            })
            menu.popup({
                window: remote.getCurrentWindow()
            })
        }
    },[dependence])
}

export default useContextMenu