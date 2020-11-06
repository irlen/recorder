const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const isDev = require("electron-is-dev")
const path = require('path')
let mainWindow,modalWindow;
//控制只能开启一个窗口
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (win) {
      win.show()
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
  app.on('ready', createWindow)
}

function createWindow(){
  console.log("8888888888888888888888888888888888888888888888888888888888")
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    autoHideMenuBar :true,//隐藏目录
    // resizable: false,
    webPreferences:{
      nodeIntegration: true, //可以在react中使用node
      enableRemoteModule: true //remote模块可以在渲染进程中使用electron的部分api
    }
  })
  const urlLocation = isDev?"http://localhost:3000":"dummy";
  mainWindow.loadURL(urlLocation);
  mainWindow.webContents.openDevTools(); //打开开发者工具
  mainWindow.on('closed',()=>{
    mainWindow = null;
  })

  //监听渲染进程发送来的消息
  ipcMain.on('fortest',(event,arg)=>{
    // modalWindow = new BrowserWindow({
    //   width: 800,
    //   height: 600,
    //   parent: mainWindow,
    //   autoHideMenuBar :true,
    //   webPreferences:{
    //     nodeIntegration: true, //可以在react中使用node
    //   },
    //   show: false,
    //   backgroundColor:"#efefef"
    // })
    // modalWindow.once('ready-to-show',()=>{
    //   modalWindow.show();
    // })

    //modalWindow.loadURL(`file://${path.join(__dirname,"./src/Home/modal.html")}`)
    console.log("接受到信息")

    dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      multiSelections: false,
      message:'选择文件的存储路径',
    }).then(result => {
      console.log(result.canceled)
      console.log(result.filePaths)
      event.reply('reply',result.filePaths)
    }).catch(err => {
      console.log(err)
    })

  })
}
