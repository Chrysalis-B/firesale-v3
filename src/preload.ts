import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  onFileOpen: (callback: (content: string) => void) => {
    ipcRenderer.on('file-opened', (_event, content: string) => {
      callback(content);
    });
  },
  showOpenDialog: () => {
    ipcRenderer.send('show-open-dialog');
  },
  saveFile: (content: string) => {
    ipcRenderer.send('save-file', content);
  },
  exportHtml: (html: string) => {
    ipcRenderer.send('export-html', html);
  },
});
