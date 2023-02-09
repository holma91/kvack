const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../../api';
import { getCSSInserts, getRelevantApi } from '../../utils/helper';
import { settings } from '../../../utils/settings';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);
contextBridge.exposeInMainWorld('api', relevantApi);

const extensionId = 'google';
const selectedGroup = 'google'; // need to get this from the main process somehow
const config = settings.groups[selectedGroup].extensionSettings[extensionId];
const css = getCSSInserts(extensionId, config);
webFrame.insertCSS(css);

// todo: do different stuff depending on the url

window.addEventListener('DOMContentLoaded', () => {
  const searchInput: any = document.querySelector('input[name="q"]');
  const searchButton: any = document.querySelector('.Tg7LZd');

  ipcRenderer.on('searchInput', (_event, value) => {
    if (value === 'Enter') {
      // search
      searchButton.click();
    } else {
      searchInput.value = value;
    }
  });
});
