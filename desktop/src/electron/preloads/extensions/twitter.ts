const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../../api';
import { getCSSInserts, getRelevantApi } from '../../utils/helper';
import { settings } from '../../../utils/settings';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);
contextBridge.exposeInMainWorld('api', relevantApi);

const extensionId = 'twitter';
const selectedGroup = 'twitter'; // need to get this from the main process somehow
const config = settings.groups[selectedGroup].extensionSettings[extensionId];
const css = getCSSInserts(extensionId, config);
webFrame.insertCSS(css);

window.addEventListener('DOMContentLoaded', () => {
  let searchInput: any = document.querySelector('[aria-label="Search query"]');

  ipcRenderer.on('searchInput', (_event, value) => {
    searchInput = document.querySelector('[aria-label="Search query"]');
    if (value === 'Enter') {
      window.location.href = `https://twitter.com/search?q=${searchInput.value}&src=typed_query`;
    } else {
      searchInput.value = value;
    }
  });
});
