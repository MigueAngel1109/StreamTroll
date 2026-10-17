const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
let mainWindow = null;
let tiktokConnection = null;

// Start local HTTP server for OBS Studio Browser Source in production
const OBS_PORT = 18923;
let obsServer = null;

function startObsServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
  };

  obsServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const distPath = path.join(__dirname, '../dist');
    let safeUrl = req.url.split('?')[0];
    let filePath = path.join(distPath, safeUrl === '/' ? 'index.html' : safeUrl);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
      }
    });
  });

  obsServer.listen(OBS_PORT, '127.0.0.1', () => {
    console.log(`OBS Server ready on http://127.0.0.1:${OBS_PORT}/#/overlay`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
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

// Function to resolve WebcastPushConnection class across different versions of tiktok-live-connector
function getWebcastPushConnectionClass() {
  // tiktok-live-connector v2.x exports WebcastPushConnection from the /legacy subpath
  try {
    const legacy = require('tiktok-live-connector/legacy');
    if (legacy && typeof legacy.WebcastPushConnection === 'function') {
      return legacy.WebcastPushConnection;
    }
  } catch (e) {
    // Legacy subpath not found, try root
  }

  // Fallback for tiktok-live-connector v1.x or direct export
  try {
    const mainMod = require('tiktok-live-connector');
    if (mainMod && typeof mainMod.WebcastPushConnection === 'function') {
      return mainMod.WebcastPushConnection;
    }
    if (mainMod && typeof mainMod.TikTokLiveConnection === 'function') {
      return mainMod.TikTokLiveConnection;
    }
    if (typeof mainMod === 'function') {
      return mainMod;
    }
    if (mainMod && mainMod.default && typeof mainMod.default.WebcastPushConnection === 'function') {
      return mainMod.default.WebcastPushConnection;
    }
    if (mainMod && mainMod.default && typeof mainMod.default === 'function') {
      return mainMod.default;
    }
  } catch (e) {
    console.error('Error cargando tiktok-live-connector:', e);
  }

  throw new Error('No se pudo encontrar la clase constructora WebcastPushConnection en la librería tiktok-live-connector.');
}

// TikTok Live IPC Handlers
ipcMain.handle('tiktok:connect', async (event, username) => {
  try {
    const WebcastPushConnection = getWebcastPushConnectionClass();
    if (tiktokConnection) {
      try { tiktokConnection.disconnect(); } catch (e) {}
    }

    const cleanUser = username ? username.replace(/^@/, '').trim() : '';
    if (!cleanUser) {
      return { success: false, error: 'Por favor ingresa un nombre de usuario de TikTok.' };
    }

    tiktokConnection = new WebcastPushConnection(cleanUser, {
      processInitialData: false,
      enableExtendedGiftInfo: true,
      requestPollingIntervalMs: 1000
    });

    const state = await tiktokConnection.connect();

    tiktokConnection.on('gift', (data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:gift', {
          user: data.uniqueId || data.nickname || 'Anónimo',
          giftName: data.giftName || 'Regalo',
          diamondCount: data.diamondCount || 0,
          repeatCount: data.repeatCount || 1,
          timestamp: Date.now()
        });
      }
    });

    tiktokConnection.on('disconnected', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:status', { connected: false, message: 'Desconectado de TikTok Live' });
      }
    });

    tiktokConnection.on('streamEnd', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('tiktok:status', { connected: false, message: 'La transmisión en vivo de TikTok ha finalizado.' });
      }
    });

    tiktokConnection.on('error', (err) => {
      console.error('TikTok Live runtime error:', err);
    });

    return { success: true, roomId: state.roomId, username: cleanUser };
  } catch (error) {
    let msg = error.message || 'No se pudo conectar con el directo de TikTok. Verifica que el usuario esté en directo actualmente.';
    if (msg.includes('Failed to retrieve Room ID') || msg.includes('LIVE has ended') || msg.includes('User is offline') || msg.includes('not currently live')) {
      msg = `El usuario @${username ? username.replace(/^@/, '').trim() : ''} no está en directo en este momento o el usuario no existe. Asegúrate de que la transmisión esté activa en TikTok.`;
    }
    return { success: false, error: msg };
  }
});

ipcMain.handle('tiktok:disconnect', async () => {
  if (tiktokConnection) {
    try { tiktokConnection.disconnect(); } catch (e) {}
    tiktokConnection = null;
  }
  return { success: true };
});

app.whenReady().then(() => {
  startObsServer();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (obsServer) {
    try { obsServer.close(); } catch (e) {}
  }
  if (process.platform !== 'darwin') app.quit();
});
