import { app, BrowserWindow, ipcMain } from 'electron';
import { createWindow } from './mainWindow';
import { showOpenDialog, showSaveDialog } from './dialogHandler';
import { saveFile, openFile } from './fileUtils';
import { sendFileOpened, sendFileSaved } from './windowEmitter';

interface File {
  path?: string;
  content?: string;
}

const currentFile = {} as File;

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
    .then(filePath => {
      if (filePath) {
        currentFile.path = filePath;
        return openFile(filePath);
      }
      return '';
    })
    .then(content => {
      currentFile.content = content;
      sendFileOpened(browserWindow, content);
    });
});

ipcMain.on('save-file', (event, content: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  if (currentFile.path) {
    saveFile(currentFile.path, content);
    currentFile.content = content;
    sendFileSaved(browserWindow);
    return;
  }

  showSaveDialog(browserWindow, currentFile.path, 'markDown')
    .then(filePath => {
      if (filePath) {
        saveFile(filePath, content);
        currentFile.path = filePath;
        currentFile.content = content;
      }
    })
    .then(() => sendFileSaved(browserWindow));
});

ipcMain.on('export-html', (event, html: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  showSaveDialog(browserWindow, currentFile.path, 'html')
    .then(filePath => (filePath ? saveFile(filePath, html) : undefined))
    .then(() => sendFileSaved(browserWindow));
});
