import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  ipcRenderer,
} from 'electron';
import path from 'path';
import { injects } from './injects';
import { Group, groups, idToUrl } from '../utils/utils';

type WindowSettings = {
  height: number;
  width: number;
};

type ViewStateMap = {
  loadedInitialURL: boolean;
};
type GroupStateMap = {
  loadedInitialURLs: boolean[];
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
  selectedGroup: string = '';

  groupMap: { [key: string]: Group } = {};
  groupStateMap: { [key: string]: GroupStateMap } = {};

  constructor(url: string, preload: string) {
    let window = new BrowserWindow({
      height: 850,
      width: 1400,
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

  createGroup(id: string) {
    const group = groups[id];

    for (let i = 0; i < group.extensions.length; i++) {
      let view = new BrowserView({
        webPreferences: defaultViewWebPreferences,
      });

      group.views[i] = view;
    }

    this.groupMap[id] = group;
    // maybe set up listeners like view.webContents.on("blah")
  }

  setGroup(id: string) {
    let group = this.groupMap[id];
    if (!group) return;

    for (let i = 0; i < group.extensions.length; i++) {
      if (i === 0) {
        this.mainWindow.setBrowserView(group.views[i]);
      } else {
        this.mainWindow.addBrowserView(group.views[i]);
      }

      if (!group.loadedInitialURLs[i]) {
        group.views[i].webContents.loadURL(idToUrl[group.extensions[i]]);
        group.views[i].webContents.on('did-finish-load', () => {
          group.views[i].webContents.insertCSS(
            injects[groups[id].extensions[i]].css
          );
          group.views[i].webContents
            .executeJavaScript(injects[groups[id].extensions[i]].js)
            .then(() => {
              console.log('success?');
            });
        });
        group.loadedInitialURLs[i] = true;
      }

      // always set bounds
      this.setBounds(group, i);
    }

    this.selectedGroup = id;
  }

  setBounds(group: Group, i: number) {
    const [width, height] = this.mainWindow.getSize();
    const [_, contentHeight] = this.mainWindow.getContentSize();
    const topFrame = height - contentHeight;

    // bounds values MUST be positive
    let bounds = {
      x: Math.round((SIDEBAR_SIZE + width) * group.xOffsets[i]),
      y: Math.round(HEADER_SIZE + topFrame),
      width: Math.round((width - SIDEBAR_SIZE) * group.dimensions[i]),
      height: Math.round(contentHeight - HEADER_SIZE),
    };

    group.views[i].setBounds(bounds);
    group.views[i].setAutoResize({
      height: true,
      width: true,
      horizontal: true,
    });
  }
}

export default MainProcess;
