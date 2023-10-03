import { BrowserWindow, dialog } from 'electron';
import { readFile, writeFile } from 'fs/promises';

export const showOpenDialog = async (browserWindow: BrowserWindow) => {
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

export const showSaveDialog = async (
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
