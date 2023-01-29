import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  ipcRenderer,
} from 'electron';
import path from 'path';
import { injects } from './injects';
import { idToUrl } from '../utils/utils';

type WindowSettings = {
  height: number;
  width: number;
};

type ViewStateMap = {
  loadedInitialURL: boolean;
};

const HEADER_SIZE = 76;
const SIDEBAR_SIZE = 0;

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
      title: 'kvack',
      // type: 'panel',
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

      // maybe set up listeners like view.webContents.on("blah")
    }
  }

  setView(id: string) {
    let view = this.viewMap[id];
    if (!view) return;

    this.mainWindow.setBrowserView(view);
    if (!this.viewStateMap[id].loadedInitialURL) {
      view.webContents.loadURL(idToUrl[id]);
      // view.webContents.openDevTools();
      view.webContents.on('did-finish-load', () => {
        view.webContents.insertCSS(injects[id].css);
        view.webContents.executeJavaScript(injects[id].js).then(() => {
          console.log('success?');
        });
      });

      const [width, height] = this.mainWindow.getSize();
      const [_, contentHeight] = this.mainWindow.getContentSize();
      const topFrame = height - contentHeight;

      let bounds = {
        x: Math.round(SIDEBAR_SIZE),
        y: Math.round(HEADER_SIZE + topFrame),
        width: Math.round(width - SIDEBAR_SIZE),
        height: Math.round(contentHeight - HEADER_SIZE),
      };

      view.setBounds(bounds);
      view.setAutoResize({ height: true, width: true });

      this.viewStateMap[id].loadedInitialURL = true;
    }

    this.selectedView = id;
  }
}

export default MainProcess;
