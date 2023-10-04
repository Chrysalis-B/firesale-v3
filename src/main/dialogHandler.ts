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

export const showSaveDialog = async (
  browserWindow: BrowserWindow,
  type: 'html' | 'markDown' = 'markDown'
) => {
  const result = await dialog.showSaveDialog(browserWindow, {
    properties: ['createDirectory'],
    filters: [
      {
        name: type === 'html' ? 'HTML File' : 'Markdown File',
        extensions: [type === 'html' ? 'html' : 'md'],
      },
    ],
  });

  const { canceled, filePath } = result;

  if (canceled || !filePath) return;

  return filePath;
};
