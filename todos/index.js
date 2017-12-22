const electron = require("electron")
const { app, BrowserWindow, Menu, ipcMain } = electron

const isMac = process.platform === "darwin"
const isDev = process.env.NODE_ENV !== "production"

let mainWindow
let addWindow

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add todo",
        accelerator: isMac ? "Cmd+N" : "Ctrl+N",
        click() {
          createAddWindow()
        }
      },
      {
        label: "Quit",
        accelerator: isMac ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit()
        }
      }
    ]
  }
]

if (isMac) menuTemplate.unshift({})

if (isDev) menuTemplate.push({
  label: "View",
  submenu: [
    {
      label: "Toggle Dev Tools",
      accelerator: isMac ? "Cmd+Alt+I" : "Ctrl+Alt+I",
      click(item, focusWindow) {
        focusWindow.toggleDevTools()
      }
    }
  ]
})

const createAddWindow = () => {
  addWindow = new BrowserWindow({ width: 300, height: 200, title: "Create new todo" })
  addWindow.loadURL(`file://${__dirname}/add.html`)
}

app.on("ready", () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  mainWindow.on("closed", () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

ipcMain.on("todo:value", (event, data) => {
  mainWindow.webContents.send("todo:value", data)
})