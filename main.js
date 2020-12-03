const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron")
const isDev = require("electron-is-dev")
const path = require('path')
const url = require('url')
const child_process = require("child_process")
const template = require("./src/menu")

let mainWindow,modalWindow;
//控制只能开启一个窗口
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      mainWindow.show()
      if (mainWindow.isMinimized()){
        mainWindow.restore()
      } 
      mainWindow.focus()
    }
  })
  app.on('ready', ()=>{
    createWindow()
  })
}

function createWindow(){
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    autoHideMenuBar :false,//隐藏目录
    show: false,//先隐藏，等server起来之后再显示
    // resizable: false,
    webPreferences:{
      nodeIntegration: true, //可以在react中使用node
      enableRemoteModule: true //remote模块可以在渲染进程中使用electron的部分api
    }
  })

  
  if(isDev){
    mainWindow.loadURL("http://localhost:3000");
  }else{
    mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, "build","index.html"),
			protocol: 'file',
		  // 当窗口关闭时候的事件.
			slashes: true
		}))
  }

  // set the menu
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.webContents.openDevTools(); //打开开发者工具
  mainWindow.on('closed',()=>{
    mainWindow = null;
  })
  createServer(mainWindow)
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


const createServer = (win)=>{
  let script = path.join(__dirname,"./","py","app.exe")
  server = child_process.exec(script,{})
  server.stdout.on('data', function (data) {
		//win.maximize();
		win.show();
  });
  if (server != null) {
		server.on('close', (code) => {
		  console.log(`http child process exited with code ${code}`);
		});
	}
}

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}else{
		mainWindow.show()
	}
})

//当所有窗口关闭时
app.on('window-all-closed', () => {
  if (server){
    //杀死后台进程
    try{
      child_process.execSync("taskkill /IM app.exe /f")
    }catch(e){
      console.log("不按比进程出错",e)
    }
    server.kill()
    server=null
  }

  app.quit()
})