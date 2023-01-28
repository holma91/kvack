import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  ipcRenderer,
} from 'electron';
import path from 'path';

type WindowSettings = {
  height: number;
  width: number;
};

type ViewStateMap = {
  loadedInitialURL: boolean;
};

const HEADER_SIZE = 76;
const SIDEBAR_SIZE = 325;

const defaultViewWebPreferences = {
  nodeIntegration: false,
  nodeIntegrationInSubFrames: true,
  scrollBounce: true,
  safeDialogs: true,
  safeDialogsMessage: 'Prevent this page from creating additional dialogs',
  preload:
    '/Users/lapuerta/dev/kvack/desktop/.webpack/renderer/main_window/preload.js',
  contextIsolation: true,
  sandbox: true,
  enableRemoteModule: false,
  allowPopups: false,
  // partition: partition || 'persist:webcontent',
  enableWebSQL: false,
  // match Chrome's default for anti-fingerprinting purposes (Electron defaults to 0)
  minimumFontSize: 6,
};

const idToUrl: { [key: string]: string } = {
  google: 'https://google.com',
  duckduckgo: 'https://duckduckgo.com',
  wolframalpha: 'https://wolframalpha.com',
};

// 1 MainWindow have 1 BrowserWindow and multiple BrowserViews
class MainProcess {
  mainWindow: BrowserWindow;
  viewMap: { [key: string]: BrowserView } = {};
  viewStateMap: { [key: string]: ViewStateMap } = {};
  selectedView: string = '';
  viewCount: number = 0;

  constructor(url: string, preload: string) {
    let window = new BrowserWindow({
      height: 800,
      width: 1200,
      frame: true,
      webPreferences: {
        preload,
      },
    });

    window.loadURL(url);
    this.mainWindow = window;
  }

  createView(id: string) {
    // 1 view per ID
    if (!this.viewMap[id]) {
      let view = new BrowserView({
        webPreferences: defaultViewWebPreferences,
      });

      this.viewMap[id] = view;
      this.viewStateMap[id] = { loadedInitialURL: false };
    }
  }

  setView(id: string) {
    if (this.viewMap[id] && this.selectedView !== id) {
      this.mainWindow.setBrowserView(this.viewMap[id]);
      this.viewMap[id].webContents.loadURL(idToUrl[id]);
      const [width, height] = this.mainWindow.getSize();
      const [_, contentHeight] = this.mainWindow.getContentSize();
      const topFrame = height - contentHeight;

      let bounds = {
        x: Math.round(SIDEBAR_SIZE),
        y: Math.round(HEADER_SIZE + topFrame),
        width: Math.round(width - SIDEBAR_SIZE),
        height: Math.round(contentHeight - HEADER_SIZE),
      };
      console.log(bounds);

      this.viewMap[id].setBounds(bounds);
      this.viewMap[id].setAutoResize({ height: true, width: true });
      this.selectedView = id;
    }
  }
}

export default MainProcess;
