const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs');
const api = require('./api/express-api.js');

// Use the experiment module



function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true
    },
    type: 'floating'
  });

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/* 

Make usersettings read from file 
Make alternative route without API key
Download folder on click 
Filetype actually doing something

*/
