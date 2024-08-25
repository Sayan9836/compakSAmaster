
const { app, BrowserWindow } = require('electron')

let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        icon: `file://${__dirname}/www/assets/icon/favicon.png`
    })

    win.loadURL(`file://${__dirname}/www/index.html`)

    // uncomment below to open the DevTools.
    // win.webContents.openDevTools()

    // Event when the window is closed.
    win.on('closed', function () {
        win = null
    })
    win.once('ready-to-show', () => {
        mainWindow.show()
    })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // macOS specific close process
    if (win === null) {
        createWindow()
    }
})