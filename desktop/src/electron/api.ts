import { ipcRenderer } from 'electron';
const api = {
  setView: (viewId: string) => ipcRenderer.send('setView', viewId),
  createView: () => ipcRenderer.send('createView'),
  // onNextTab: (callback: any) => ipcRenderer.on('nextTab', callback),
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
};

export default api;
