import { app, BrowserWindow, ipcMain } from 'electron';
import { createWindow } from './mainWindow';
import { showOpenDialog, showSaveDialog } from './dialogHandler';
import { saveFile, openFile } from './fileUtils';
import { sendFileOpened, sendFileSaved } from './windowEmitter';
import { getCurrentFile, setCurrentFile } from './currentFile';

app.on('ready', createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('show-open-dialog', event => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showOpenDialog(browserWindow).then(filePath => {
    if (filePath) {
      openFile(filePath).then(content => {
        setCurrentFile(browserWindow, filePath, content);
        sendFileOpened(browserWindow, content);
      });
    }
  });
});

ipcMain.on('save-file', (event, content: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  const { path } = getCurrentFile();

  if (path) {
    saveFile(path, content);
    setCurrentFile(browserWindow, path, content);
    sendFileSaved(browserWindow);
    return;
  }

  showSaveDialog(browserWindow, 'markDown')
    .then(filePath => {
      if (filePath) {
        saveFile(filePath, content);
        setCurrentFile(browserWindow, filePath, content);
      }
    })
    .then(() => sendFileSaved(browserWindow));
});

ipcMain.on('export-html', (event, html: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showSaveDialog(browserWindow, 'html')
    .then(filePath => (filePath ? saveFile(filePath, html) : undefined))
    .then(() => sendFileSaved(browserWindow));
});
