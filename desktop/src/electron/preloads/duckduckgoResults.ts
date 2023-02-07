const { contextBridge, webFrame } = require('electron');
import api from '../api';

contextBridge.exposeInMainWorld('api', api);

const css = `
  .site-wrapper.js-site-wrapper {
    background-color: #171717;
  }
  
  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);
