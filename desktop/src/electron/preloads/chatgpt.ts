const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);
contextBridge.exposeInMainWorld('api', relevantApi);

const css = `
  /* input */

  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);

window.addEventListener('DOMContentLoaded', () => {
  const searchInput: any = document.querySelector(
    '.m-0.w-full.resize-none.border-0.bg-transparent.p-0.pl-2.pr-7'
  );
  const searchButton: any = document.querySelector(
    '.absolute.p-1.rounded-md.text-gray-500'
  );

  ipcRenderer.on('searchInput', (_event, value) => {
    if (value === 'Enter') {
      // search
      searchButton.click();
    } else {
      searchInput.value = value;
    }
  });
});
