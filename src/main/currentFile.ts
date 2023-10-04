import { BrowserWindow, app } from 'electron';
import { basename } from 'path';

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

  app.addRecentDocument(path);
  browserWindow.setTitle(`${basename(path)} -  ${app.name}`);
  browserWindow.setRepresentedFilename(path);
};

export const getCurrentFile = () => {
  return currentFile;
};

export const hasChanged = (content: string) => {
  return currentFile.content !== content;
};
