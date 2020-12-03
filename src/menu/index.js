const { app, shell } = require('electron')

let template = [
    {
        label: "文件",
        submenu:[
            {
                label: "新建文件",
                accelerator: "CmdOrCtrl+N",
                click: (menuItem, broserWindow, event)=>{
                    broserWindow.webContents.send("new-file")
                }
            },{
                label: "新建文件夹",
                accelerator: "CmdOrCtrl+M",
                click: (menuItem, broserWindow, event)=>{
                    broserWindow.webContents.send("new-folder")
                }
            },{
                label: "保存",
                accelerator: "CmdOrCtrl+S",
                click: (menuItem, broserWindow, event)=>{
                    broserWindow.webContents.send("save-current-file")
                }
            }
        ]
    },{
        label: "视图",
        submenu: [
            {
                label: "刷新当前页面",
                accelerator: "CmdOrCtrl+R",
                click:(item,focusedWindow)=>{
                    if(focusedWindow){
                        focusedWindow.reload()
                    }
                }
            }
        ]
    }
]

module.exports = template