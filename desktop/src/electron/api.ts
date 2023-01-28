const { ipcRenderer } = require('electron');

const api = {
  // setTitle: (title) => ipcRenderer.send('set-title', title),
  openSite: (site: string, sidebarWidth: number, headerHeight: number) =>
    ipcRenderer.send('change-site', site, sidebarWidth, headerHeight),
  sayHello: () => console.log('hello'),
  setView: (viewId: string) => ipcRenderer.send('setView', viewId),
  createView: () => ipcRenderer.send('createView'),
  // openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
  // ipcRenderer,
};

export default api;
