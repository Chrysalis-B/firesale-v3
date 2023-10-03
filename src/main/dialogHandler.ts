import { BrowserWindow, dialog } from 'electron';

export const showOpenDialog = async (browserWindow: BrowserWindow) => {
  const result = await dialog.showOpenDialog(browserWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Markdown File', extensions: ['md'] }],
  });

  if (result.canceled) return;

  const [filePath] = result.filePaths;

  return filePath;
};

export const showSaveDialog = async (browserWindow: BrowserWindow) => {
  const result = await dialog.showSaveDialog(browserWindow, {
    properties: ['createDirectory'],
    filters: [{ name: 'HTML File', extensions: ['html'] }],
  });

  if (result.canceled || !result.filePath) return;

  return result.filePath;
};
