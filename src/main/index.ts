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

ipcMain.on('show-open-dialog', async (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  const filePath = await showOpenDialog(browserWindow);

  if (filePath) {
    const content = await openFile(browserWindow, filePath);
    content && sendFileOpened(browserWindow, content);
  }
});

ipcMain.on('show-save-dialog', async (event, content: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  const filePath = await showSaveDialog(browserWindow);

  if (filePath) {
    await saveFile(filePath, content);
    sendFileSaved(browserWindow, filePath);
  }
});
