import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.openDevTools({
    mode: 'detach',
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('show-open-dialog', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showOpenDialog(browserWindow);
});

ipcMain.on('show-save-dialog', (event, content: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showSaveDialog(browserWindow, content);
});

const showOpenDialog = async (browserWindow: BrowserWindow) => {
  try {
    const result = await dialog.showOpenDialog(browserWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Markdown File', extensions: ['md'] }],
    });

    if (result.canceled) return;

    const [filePath] = result.filePaths;

    openFile(browserWindow, filePath);
  } catch (err) {
    console.error('Falied to open dialog', err);
  }
};

const showSaveDialog = async (
  browserWindow: BrowserWindow,
  content: string
) => {
  try {
    const result = await dialog.showSaveDialog(browserWindow, {
      properties: ['createDirectory'],
      filters: [{ name: 'HTML File', extensions: ['html'] }],
    });

    if (result.canceled || !result.filePath) return;

    saveFile(browserWindow, result.filePath, content);
  } catch (err) {
    console.error('Falied to save dialog', err);
  }
};

const openFile = async (browserWindow: BrowserWindow, filePath: string) => {
  try {
    const content = await readFile(filePath, { encoding: 'utf-8' });

    browserWindow.webContents.send('file-opened', content);
  } catch (err) {
    console.error('Failed to open file', err);
  }
};

const saveFile = async (
  browserWindow: BrowserWindow,
  filePath: string,
  content: string
) => {
  try {
    await writeFile(filePath, content, { encoding: 'utf-8' });

    browserWindow.webContents.send('file-saved', filePath);
  } catch (err) {
    console.error('Failed to save file', err);
  }
};
