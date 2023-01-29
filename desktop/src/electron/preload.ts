const { contextBridge, webFrame } = require('electron');
import api from './api';

contextBridge.exposeInMainWorld('api', api);
// webFrame.insertCSS('html, body { background-color: #ff0; }');
