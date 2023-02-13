import { ipcRenderer } from 'electron';

const api: { [key: string]: any } = {
  changeSearchInput: (input: string) => ipcRenderer.send('searchInput', input),
  onSelectedGroupChange: (callback: any) => {
    ipcRenderer.on('selectedGroupChange', callback);
    return () => [ipcRenderer.removeAllListeners('selectedGroupChange')];
  },
  onSelectedTabChange: (callback: any) => {
    ipcRenderer.on('selectedTabChange', callback);
    return () => [ipcRenderer.removeAllListeners('selectedTabChange')];
  },
  onShowSidebar: (callback: any) => {
    ipcRenderer.on('showSidebar', callback);
    return () => {
      ipcRenderer.removeAllListeners('showSidebar');
    };
  },
  onHideSidebar: (callback: any) => {
    ipcRenderer.on('hideSidebar', callback);
    return () => {
      ipcRenderer.removeAllListeners('hideSidebar');
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
