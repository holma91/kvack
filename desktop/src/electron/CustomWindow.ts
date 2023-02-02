import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  ipcRenderer,
} from 'electron';
import path from 'path';
import { injects } from './injects';
import { Group, ExtendedView, groups, idToUrl } from '../utils/utils';

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

  separatorEntry: string;
  separatorPreload: string;

  constructor(
    url: string,
    preload: string,
    separatorEntry: string,
    separatorPreload: string
  ) {
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

    this.separatorEntry = separatorEntry;
    this.separatorPreload = separatorPreload;
  }

  createGroup(id: string) {
    const group = groups[id];

    for (let i = 0; i < group.extensions.length; i++) {
      let view = new BrowserView({
        webPreferences: defaultViewWebPreferences,
      });
      group.views[i].view = view;
    }

    this.groupMap[id] = group;
    // maybe set up listeners like view.webContents.on("blah")
  }

  setGroup(id: string) {
    let group = this.groupMap[id];
    if (!group) return;

    for (let i = 0; i < group.extensions.length; i++) {
      let extendedView = group.views[i];
      if (i === 0) {
        this.mainWindow.setBrowserView(extendedView.view);
      } else {
        this.mainWindow.addBrowserView(extendedView.view);
      }

      if (!extendedView.loadedInitialURL) {
        console.log(
          'sep entry',
          extendedView.id === 'separator'
            ? this.separatorEntry
            : idToUrl[extendedView.id]
        );

        extendedView.view.webContents.loadURL(
          extendedView.id === 'separator'
            ? this.separatorEntry
            : idToUrl[extendedView.id]
        );
        // extendedView.view.webContents.on('did-finish-load', () => {
        //   extendedView.view.webContents.insertCSS(injects[extendedView.id].css);
        //   extendedView.view.webContents
        //     .executeJavaScript(injects[extendedView.id].js)
        //     .then(() => {
        //       console.log('success?');
        //     });
        // });

        extendedView.loadedInitialURL = true;
      }

      // always set bounds
      this.setBounds(extendedView);
    }

    this.selectedGroup = id;
    console.log(id, 'loaded');
  }

  setBounds(extendedView: ExtendedView) {
    const [width, height] = this.mainWindow.getSize();
    const [_, contentHeight] = this.mainWindow.getContentSize();
    const topFrame = height - contentHeight;

    // bounds values MUST be integers
    let bounds = {
      x: Math.round((SIDEBAR_SIZE + width) * extendedView.xOffset),
      y: Math.round(HEADER_SIZE + topFrame),
      width: Math.round((width - SIDEBAR_SIZE) * extendedView.dimension),
      height: Math.round(contentHeight - HEADER_SIZE),
    };

    extendedView.view.setBounds(bounds);
    extendedView.view.setAutoResize({
      height: true,
      width: true,
      horizontal: true,
    });
  }
}

export default MainProcess;
