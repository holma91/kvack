const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import { settings } from '../../../utils/settings';
import api from '../../api';
import { getCSSInserts, getRelevantApi } from '../../utils/helper';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);
const extensionId = 'wolframalpha';
const selectedGroup = 'wolframalpha'; // need to get this from the main process somehow
const config = settings.groups[selectedGroup].extensionSettings[extensionId];
const css = getCSSInserts(extensionId, config);
webFrame.insertCSS(css);

webFrame.insertCSS(css);

window.addEventListener('DOMContentLoaded', () => {
  // maybe set up event listeners for the elements?
  // look into the form element
  // setAttribute
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
      searchInput.dispatchEvent(new Event('change'));
      inputSpan.innerHTML = value;
      console.log('searchInput.value:', searchInput.value);
    }
  });
});
