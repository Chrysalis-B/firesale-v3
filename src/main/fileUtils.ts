import { readFile, writeFile } from 'fs/promises';

export const openFile = (filePath: string) => {
  return readFile(filePath, { encoding: 'utf-8' });
};

export const saveFile = async (filePath: string, content: string) => {
  await writeFile(filePath, content, { encoding: 'utf-8' });
};
