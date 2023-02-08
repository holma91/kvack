const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);
contextBridge.exposeInMainWorld('api', relevantApi);

const css = `
  /* input */
  .m-0.w-full.resize-none.border-0.bg-transparent.p-0.pl-2.pr-7.focus:ring-0.focus-visible:ring-0.dark:bg-transparent.md:pl-0 {
    background-color: green;
  }

  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);
