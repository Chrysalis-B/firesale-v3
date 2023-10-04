import { renderMarkdown } from './markdown';
import Elements from './elements';

window.api.onFileOpen((content: string) => {
  Elements.MarkdownView.value = content;
  renderMarkdown(content);
});

Elements.MarkdownView.addEventListener('input', async () => {
  const markdown = Elements.MarkdownView.value;
  renderMarkdown(markdown);
});

Elements.OpenFileButton.addEventListener('click', () => {
  window.api.showOpenDialog();
});

Elements.ExportHtmlButton.addEventListener('click', () => {
  const html = Elements.RenderedView.innerHTML;
  window.api.exportHtml(html);
});

Elements.SaveMarkdownButton.addEventListener('click', () => {
  const markdown = Elements.MarkdownView.value;
  window.api.saveFile(markdown);
});
