const { contextBridge, webFrame } = require('electron');
import api from '../api';

contextBridge.exposeInMainWorld('api', api);
// console.log('goolybib');
// webFrame.executeJavaScript("console.log('ayooo')");

const css = `

  /* header */
  .o3j99.n1xJcf.Ne6nSd {
    display: none !important;
  }
  
  /* google logo part */
  .o3j99.LLD4me.yr19Zb.LS8OJ {
    display: none !important;
  }
`;

// webFrame.insertCSS('html, body { background-color: #ff0 !important; }');
webFrame.insertCSS(css);

function search() {
  const input = document.querySelector('input[name="q"]');
  input.value = 'test';
}

setTimeout(function () {
  // alert('Hello');
  search();
}, 3000);
