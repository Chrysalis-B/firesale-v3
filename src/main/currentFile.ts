import { BrowserWindow, app } from 'electron';

const currentFile = {
  path: '',
  content: '',
};

export const setCurrentFile = (
  browserWindow: BrowserWindow,
  path: string,
  content: string
) => {
  currentFile.path = path;
  currentFile.content = content;
  browserWindow.setTitle(`${path} -  ${app.name}`);
  browserWindow.setRepresentedFilename(path);
};

export const getCurrentFile = () => {
  return currentFile;
};
