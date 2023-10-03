import { BrowserWindow } from 'electron';

export const sendFileOpened = (
  browserWindow: BrowserWindow,
  content: string
) => {
  browserWindow.webContents.send('file-opened', content);
};

export const sendFileSaved = (
  browserWindow: BrowserWindow,
  filePath: string
) => {
  browserWindow.webContents.send('file-saved', filePath);
};
