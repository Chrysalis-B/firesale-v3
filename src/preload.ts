import { ipcRenderer, contextBridge } from 'electron';
import Elements from './renderer/elements';
import { renderMarkdown } from './renderer/markdown';

ipcRenderer.on('file-opened', (_event, content: string) => {
  Elements.MarkdownView.value = content;
  renderMarkdown(content);
});

contextBridge.exposeInMainWorld('api', {
  showOpenDialog: () => {
    ipcRenderer.send('show-open-dialog');
  },
  showSaveDialog: (content: string) => {
    ipcRenderer.send('show-save-dialog', content);
  },
});
