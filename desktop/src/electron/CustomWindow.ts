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

const SEPARATOR_WIDTH = 5;

// 1 MainWindow have 1 BrowserWindow and multiple BrowserViews
class MainProcess {
  mainWindow: BrowserWindow;
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

    const [width, height] = this.mainWindow.getSize();

    let leftOffsetAbsolute = 0;

    for (let i = 0; i < group.extensions.length; i++) {
      let extendedView = group.views[i];
      if (i === 0) {
        this.mainWindow.setBrowserView(extendedView.view);
      } else {
        this.mainWindow.addBrowserView(extendedView.view);
      }

      if (extendedView.id === 'separator') {
        leftOffsetAbsolute = width * extendedView.leftOffset;
      }

      if (!extendedView.loadedInitialURL) {
        extendedView.view.webContents.loadURL(
          extendedView.id === 'separator'
            ? this.separatorEntry
            : idToUrl[extendedView.id]
        );

        extendedView.view.webContents.on('did-finish-load', () => {
          extendedView.view.webContents.insertCSS(injects[extendedView.id].css);
          // extendedView.view.webContents.insertCSS(separatorCSS);
          extendedView.view.webContents.send(
            'windowResize',
            leftOffsetAbsolute
          );
        });

        extendedView.loadedInitialURL = true;
        this.setBounds(extendedView);
      }

      if (width !== group.loadedWidth || height !== group.loadedHeight) {
        // will get here if window size has changed but the group was loaded earlier

        if (group.views.length === 1) {
          this.setBounds(extendedView);
        }
      }
    }

    if (width !== group.loadedWidth || height !== group.loadedHeight) {
      if (group.views.length > 1) {
        // will get here if window size has changed but the group was loaded earlier and the group have a separator
        this.resizeSplitScreen(leftOffsetAbsolute, id);
      }
    }

    group.loadedHeight = height;
    group.loadedWidth = width;
    this.selectedGroup = id;

    console.log(id, 'loaded');
  }

  setBounds(extendedView: ExtendedView) {
    const [width, height] = this.mainWindow.getSize();
    const [_, contentHeight] = this.mainWindow.getContentSize();
    const topFrame = height - contentHeight;

    const appOffsetY = HEADER_SIZE + topFrame;
    const appSpaceY = height - appOffsetY;

    // bounds values MUST be integers
    let bounds = {
      x: Math.round(width * extendedView.x),
      y: Math.round(appOffsetY + appSpaceY * extendedView.y),
      width: Math.round(width * extendedView.width),
      height: Math.round(appSpaceY * extendedView.height),
    };

    extendedView.view.setBounds(bounds);
    extendedView.view.setAutoResize({
      // height: true,
      width: true,
      horizontal: true,
      // vertical: true,
    });
  }

  resizeSplitScreen(leftOffset: number, groupId: string) {
    const [width, _] = this.mainWindow.getSize();

    const w1 = leftOffset;
    const w2 = width - leftOffset;

    let group = this.groupMap[groupId];

    // resize all views in group accordingly
    let separator = group.views[0];
    let leftView = group.views[1];
    let rightView = group.views[2];

    leftView.x = 0 / width;
    leftView.y = 0;
    leftView.width = w1 / width;
    leftView.height = 1;

    rightView.x = Math.round(leftOffset + SEPARATOR_WIDTH) / width;
    rightView.y = 0;
    rightView.width = Math.round(w2) / width;
    rightView.height = 1;

    separator.leftOffset = leftView.width;

    // console.log(group);

    this.setBounds(leftView);
    this.setBounds(rightView);
  }
}

export default MainProcess;
