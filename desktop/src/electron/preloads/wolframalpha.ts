const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);

const css = `
  /* ad after question */
  ._2Bem > a:first-child {
    display: none;
  }

  /* sidebar ad after question */
  ._2uru > a:first-child {
    display: none;
  }

  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);

window.addEventListener('DOMContentLoaded', () => {
  const searchInput: any = document.querySelector('._O3dq');
  const inputSpan = document.querySelector('._3uiT');
  const searchButton: any = document.querySelector('._1w_c._2hsI._3HqA._29RU');

  ipcRenderer.on('searchInput', (_event, value) => {
    console.log(value);
    console.log(searchInput);
    console.log('searchInput.value:', searchInput.value);
    console.log('inputSpan.innerHTML:', inputSpan.innerHTML);

    if (value === 'Enter') {
      // search
      searchButton.click();
    } else {
      searchInput.value = value;
      inputSpan.innerHTML = value;
      console.log('searchInput.value:', searchInput.value);
    }
  });
});
