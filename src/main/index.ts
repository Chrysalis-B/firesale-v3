import { app, BrowserWindow, ipcMain } from 'electron';
import { createWindow } from './mainWindow';
import { showOpenDialog, showSaveDialog } from './dialogHandler';
import { saveFile, openFile } from './fileUtils';
import { sendFileOpened, sendFileSaved } from './windowEmitter';

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

  showOpenDialog(browserWindow)
    .then(filePath => filePath && openFile(filePath))
    .then(content => content && sendFileOpened(browserWindow, content));
});

ipcMain.on('show-save-dialog', (event, content: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showSaveDialog(browserWindow)
    .then(filePath => (filePath ? saveFile(filePath, content) : undefined))
    .then(() => sendFileSaved(browserWindow));
});
