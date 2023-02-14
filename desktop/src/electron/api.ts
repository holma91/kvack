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
  onShowSidebarChange: (callback: any) => {
    ipcRenderer.on('showSidebarChange', callback);
    return () => {
      ipcRenderer.removeAllListeners('showSidebarChange');
    };
  },
  onUrlChange: (callback: any) => {
    ipcRenderer.on('urlChange', callback);
    return () => [ipcRenderer.removeAllListeners('urlChange')];
  },
  onGroupsChange: (callback: any) => {
    ipcRenderer.on('groupsChange', callback);
    return () => [ipcRenderer.removeAllListeners('groupsChange')];
  },
  setGroup: (groupId: string) => ipcRenderer.send('setGroup', groupId),
  resizeBar: (minMax: any) => ipcRenderer.send('resize-bar', minMax),
  onWindowResize: (callback: any) => {
    ipcRenderer.on('windowResize', (event, message) => callback(message));
    return () => [ipcRenderer.removeAllListeners('windowResize')];
  },
};

export default api;
