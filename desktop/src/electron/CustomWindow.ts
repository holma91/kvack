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

    for (let i = 0; i < group.extensions.length; i++) {
      let extendedView = group.views[i];
      if (i === 0) {
        this.mainWindow.setBrowserView(extendedView.view);
      } else {
        this.mainWindow.addBrowserView(extendedView.view);
      }

      let leftOffsetAbsolute = 0;
      if (extendedView.id === 'separator') {
        leftOffsetAbsolute = width * extendedView.leftOffset;
        console.log('leftOffsetAbsolute:', leftOffsetAbsolute);
      }

      // extendedView.view.webContents.send('windowResize', leftOffset);

      if (!extendedView.loadedInitialURL) {
        extendedView.view.webContents.loadURL(
          extendedView.id === 'separator'
            ? this.separatorEntry
            : idToUrl[extendedView.id]
        );

        // get the group dimensions
        // calculate pixel sizes
        // can inject the starting separator offset here
        // extendedView.view.webContents.send('windowResize', leftOffset);

        extendedView.view.webContents.on('did-finish-load', () => {
          extendedView.view.webContents.insertCSS(injects[extendedView.id].css);
          // extendedView.view.webContents.insertCSS(separatorCSS);
          extendedView.view.webContents.send(
            'windowResize',
            leftOffsetAbsolute
          );
        });

        extendedView.loadedInitialURL = true;
        extendedView.loadedHeight = height;
        extendedView.loadedWidth = width;
        this.setBounds(extendedView);
      }

      if (
        width !== extendedView.loadedWidth ||
        height !== extendedView.loadedHeight
      ) {
        // will get here if window size has changed but the url was loaded earlier
        // extendedView.loadedHeight = height;
        // extendedView.loadedWidth = width;
        //   console.log('new leftOffset:', leftOffsetAbsolute);
        //   // extendedView.view.webContents.insertCSS(separatorCSS);
        //   extendedView.view.webContents.send('windowResize', leftOffsetAbsolute);
        //   this.setBounds(extendedView);
      }
    }

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
      height: Math.round(contentHeight),
    };

    extendedView.view.setBounds(bounds);
    extendedView.view.setAutoResize({
      // height: true,
      width: true,
      horizontal: true,
      // vertical: true,
    });
  }

  resizeBar(leftOffset: number) {
    const [width, height] = this.mainWindow.getSize();
    const [_, contentHeight] = this.mainWindow.getContentSize();
    const topFrame = height - contentHeight;

    const w1 = leftOffset;
    // const w2 = 800 - value + 30;
    const w2 = width - leftOffset; // screen width - leftOffset
    console.log(leftOffset, w1, w2);

    let group = this.groupMap[this.selectedGroup];

    // resize all views in group accordingly
    let separator = group.views[0];
    // separator.leftOffset = Math.round(leftOffset / width);
    let google = group.views[1];
    let chatgpt = group.views[2];

    let gbounds = {
      x: 0,
      y: Math.round(HEADER_SIZE + topFrame),
      width: Math.round(w1),
      height: Math.round(contentHeight - HEADER_SIZE),
    };

    google.x = gbounds.x;
    google.y = gbounds.y;
    google.width = gbounds.width / width;
    google.height = gbounds.height / width;

    let cbounds = {
      x: Math.round(leftOffset + SEPARATOR_WIDTH), // value + separator width
      y: Math.round(HEADER_SIZE + topFrame),
      width: Math.round(w2),
      height: Math.round(contentHeight - HEADER_SIZE),
    };

    chatgpt.x = cbounds.x;
    chatgpt.y = cbounds.y;
    chatgpt.width = cbounds.width / width;
    chatgpt.height = cbounds.height / width;

    separator.leftOffset = google.width;

    console.log(group);

    google.view.setBounds(gbounds);
    chatgpt.view.setBounds(cbounds);
  }
}

export default MainProcess;
