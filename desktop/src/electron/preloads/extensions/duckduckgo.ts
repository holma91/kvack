const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import { settings } from '../../../utils/settings';
import api from '../../api';
import { getCSSInserts, getRelevantApi } from '../../utils/helper';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);

const extensionId = 'duckduckgo';
const selectedGroup = 'google-duckduckgo'; // need to get this from the main process somehow
const config = settings.groups[selectedGroup].extensionSettings[extensionId];
const css = getCSSInserts(extensionId, config);
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
