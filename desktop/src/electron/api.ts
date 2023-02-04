import { ipcRenderer } from 'electron';
const api = {
  setView: (viewId: string) => ipcRenderer.send('setView', viewId),
  createView: () => ipcRenderer.send('createView'),
  resizeGroup: (
    screenX0: number,
    screenX1: number,
    t0: number,
    t1: number,
    clientX: number
  ) => ipcRenderer.send('resizeGroup', screenX0, screenX1, t0, t1, clientX),

  resizeBar: (minMax: any) => ipcRenderer.send('resize-bar', minMax),

  onWindowResize: (callback: any) => {
    ipcRenderer.on('windowResize', (event, message) => callback(message));
    return () => [ipcRenderer.removeAllListeners('windowResize')];
  },

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
