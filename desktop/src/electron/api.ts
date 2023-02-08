import { ipcRenderer } from 'electron';

const api: { [key: string]: any } = {
  changeSearchInput: (input: string) => ipcRenderer.send('searchInput', input),
  onNextTab: (callback: any) => {
    ipcRenderer.on('nextTab', callback);
    return () => {
      ipcRenderer.removeAllListeners('nextTab');
    };
  },
  onPreviousTab: (callback: any) => {
    ipcRenderer.on('previousTab', callback);
    return () => {
      ipcRenderer.removeAllListeners('previousTab');
    };
  },
  setGroup: (groupId: string) => ipcRenderer.send('setGroup', groupId),
  resizeBar: (minMax: any) => ipcRenderer.send('resize-bar', minMax),
  onWindowResize: (callback: any) => {
    ipcRenderer.on('windowResize', (event, message) => callback(message));
    return () => [ipcRenderer.removeAllListeners('windowResize')];
  },
};

export default api;
