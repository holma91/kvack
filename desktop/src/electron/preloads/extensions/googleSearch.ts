const { contextBridge, webFrame } = require('electron');
import api from '../../api';
import { getRelevantApi } from '../../utils/helper';

const functionNames = [
  'changeSearchInput',
  'onNextTab',
  'onPreviousTab',
  'setGroup',
];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi); // api.search

const css = `

  body {
    background: #171717 !important;
  }

  /* header */
  .o3j99.n1xJcf.Ne6nSd {
    display: none !important;
  }
  
  /* google logo part */
  .o3j99.LLD4me.yr19Zb.LS8OJ {
    display: none !important;
  }
  
  /* "jag har tur" part */
  .FPdoLc.lJ9FBc {
    display: none !important;
  }
  
  /* extra part */
  .vcVZ7d {
    display: none !important;
  }
  
  /* footer */
  .o3j99.c93Gbe {
    display: none !important;
  }
`;

webFrame.insertCSS(css);

// function search() {
//   const input = document.querySelector('input[name="q"]');
//   input.value = 'test';
// }

// setTimeout(function () {
//   // alert('Hello');
//   search();
// }, 3000);

// set up listener here?
