const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);

const css = `
  .site-wrapper.js-site-wrapper {
    background-color: #171717;
  }
  
  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);

window.addEventListener('DOMContentLoaded', () => {
  const searchInput: any = document.querySelector('input[name="q"]');
  const searchButton: any = document.querySelector('#search_button');

  ipcRenderer.on('searchInput', (_event, value) => {
    console.log(value);
    if (value === 'Enter') {
      searchButton.click();
    } else {
      searchInput.value = value;
    }
  });
});
