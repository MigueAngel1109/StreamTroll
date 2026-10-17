const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });

  if (isDev) {
    // In dev, load Vite's local dev server directly into dashboard
    mainWindow.loadURL('http://localhost:5173/#/dashboard');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html into dashboard
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'dashboard' });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
