const { ipcRenderer } = require('electron');

const api = {
  // setTitle: (title) => ipcRenderer.send('set-title', title),
  openSite: (site: string) => ipcRenderer.send('change-site', site),
  sayHello: () => console.log('hello'),
  // openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
  // ipcRenderer,
};

export default api;
