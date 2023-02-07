const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../api';

contextBridge.exposeInMainWorld('api', api);

const css = `
  #main {
    background-color: #171717 !important;
  }

  .V3FYCf {
    background-color: #171717 !important;
  }
  
  .kvH3mc.BToiNc.UK95Uc {
    background-color: #171717 !important;
  }

  .GLI8Bc.UK95Uc {
    background-color: #171717 !important;
  }
  
  /* allt, bilder etc */
  #pTwnEc {
    background-color: #171717 !important;
  }

  /* results */
  #appbar {
    background-color: #171717 !important;
  }
  
  /* header ish */
  .sfbg {
    background-color: #171717 !important;
  }

  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);

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
