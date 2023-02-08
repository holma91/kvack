const { contextBridge, webFrame } = require('electron');
import { ipcRenderer } from 'electron';
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames: string[] = [];
const relevantApi = getRelevantApi(api, functionNames);
contextBridge.exposeInMainWorld('api', relevantApi);

const css = `
  /* header */
  .sticky.top-0.z-10.flex.items-center.border-b.bg-gray-800.pl-1.pt-1.text-gray-200 {
    background-color: #171717;
  }
  
  /* main part */
  .text-gray-800.w-full.px-6 {
    background-color: #171717;
  }
  
  /*  main sides ish */
  .flex.flex-col.items-center.text-sm.h-full {
    background-color: #171717;
  }
  
  /* weird bottom of main part */
  .w-full.h-32.flex-shrink-0 {
    background-color: #171717;
  }

  /* bottom */
  .absolute.bottom-0.left-0.w-full.border-t.bg-white {
    background-color: #171717;
  }
  
  /* text from user */
  .w-full.border-b.text-gray-800.group {
    background-color: #171717;
    
  }
  
  /* text from gpt */
  .text-base.gap-4.m-auto.p-4.flex {
    background-color: #171717;
  }

  body::-webkit-scrollbar {
    display: none;
  }
`;

webFrame.insertCSS(css);

window.addEventListener('DOMContentLoaded', () => {
  let searchInput: any = document.querySelector(
    '.m-0.w-full.resize-none.border-0.bg-transparent.p-0.pl-2.pr-7'
  );
  let searchButton: any = document.querySelector(
    '.absolute.p-1.rounded-md.text-gray-500'
  );

  ipcRenderer.on('searchInput', (_event, value) => {
    // necessary to add this when chatgpt is small enough (prob because of that weird react minified error?)
    searchInput = document.querySelector(
      '.m-0.w-full.resize-none.border-0.bg-transparent.p-0.pl-2.pr-7'
    );
    searchButton = document.querySelector(
      '.absolute.p-1.rounded-md.text-gray-500'
    );

    if (value === 'Enter') {
      searchButton.click();
    } else {
      searchInput.value = value;
    }
  });
});
