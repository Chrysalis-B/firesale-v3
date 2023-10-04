import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  MenuItemConstructorOptions,
  Menu,
} from 'electron';
import { createWindow } from './mainWindow';
import { showOpenDialog, showSaveDialog } from './dialogHandler';
import { saveFile, openFile } from './fileUtils';
import { sendFileOpened, sendFileSaved } from './windowEmitter';
import { getCurrentFile, hasChanged, setCurrentFile } from './currentFile';

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

  handleShowOpenDialog(browserWindow);
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

ipcMain.handle('has-changed', (event, content: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  const changed = hasChanged(content);
  browserWindow?.setDocumentEdited(changed);

  return changed;
});

ipcMain.on('show-in-folder', () => {
  const { path } = getCurrentFile();

  if (!path) return;

  shell.showItemInFolder(path);
});

ipcMain.on('open-in-default-application', () => {
  const { path } = getCurrentFile();

  if (!path) return;

  shell.openPath(path);
});

const template: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click: () =>
          handleShowOpenDialog(
            BrowserWindow.getFocusedWindow() ?? createWindow()
          ),
        accelerator: 'CmdOrCtrl+O',
      },
    ],
  },
  {
    label: 'Edit',
    role: 'editMenu',
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.name,
    role: 'appMenu',
  });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const handleShowOpenDialog = (browserWindow: BrowserWindow) => {
  showOpenDialog(browserWindow).then(filePath => {
    if (filePath) {
      openFile(filePath).then(content => {
        setCurrentFile(browserWindow, filePath, content);
        sendFileOpened(browserWindow, content);
      });
    }
  });
};
