const { contextBridge, webFrame } = require('electron');
import api from '../api';

contextBridge.exposeInMainWorld('api', api);

const css = `
  body {
    background: #ff0 !important;
  }
  
  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);
