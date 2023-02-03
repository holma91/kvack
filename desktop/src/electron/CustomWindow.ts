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
      height: 600,
      width: 800,
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

      let separatorCSS = '';
      if (extendedView.id === 'separator') {
        const leftOffset = width * extendedView.leftOffset;
        console.log('leftOffset:', leftOffset);

        separatorCSS = `
          #resizer {
            left: ${leftOffset}px;
          }
        `;
      }

      if (!extendedView.loadedInitialURL) {
        extendedView.view.webContents.loadURL(
          extendedView.id === 'separator'
            ? this.separatorEntry
            : idToUrl[extendedView.id]
        );

        // get the group dimensions
        // calculate pixel sizes
        // can inject the starting separator offset here

        extendedView.view.webContents.on('did-finish-load', () => {
          extendedView.view.webContents.insertCSS(injects[extendedView.id].css);
          extendedView.view.webContents.insertCSS(separatorCSS);

          extendedView.view.webContents
            .executeJavaScript(injects[extendedView.id].js)
            .then(() => {});
        });

        extendedView.loadedInitialURL = true;
        extendedView.loadedHeight = height;
        extendedView.loadedWidth = width;
        this.setBounds(extendedView);
      }

      // setBounds if window size has changed... and insert new separator css
      if (
        width !== extendedView.loadedWidth ||
        height !== extendedView.loadedHeight
      ) {
        extendedView.loadedHeight = height;
        extendedView.loadedWidth = width;

        console.log('inserting new css');
        extendedView.view.webContents.insertCSS(separatorCSS);

        this.setBounds(extendedView);
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

    // fix shit below

    // if (extendedView.id === 'google') {
    //   bounds = { ...bounds, x: 0, width: 650 };
    // } else if (extendedView.id === 'chatgpt') {
    //   bounds = { ...bounds, x: 655, width: 145 };
    // } else if (extendedView.id === 'separator') {
    //   bounds = { ...bounds, x: 0, width: 800 };
    // }

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
    let google = group.views[1];
    let chatgpt = group.views[2];

    let gbounds = {
      x: 0,
      y: Math.round(HEADER_SIZE + topFrame),
      width: Math.round(w1),
      height: Math.round(contentHeight - HEADER_SIZE),
    };

    let cbounds = {
      x: Math.round(leftOffset + SEPARATOR_WIDTH), // value + separator width
      y: Math.round(HEADER_SIZE + topFrame),
      width: Math.round(w2),
      height: Math.round(contentHeight - HEADER_SIZE),
    };

    google.view.setBounds(gbounds);
    chatgpt.view.setBounds(cbounds);
  }

  resizeGroup(screenX0: number, screenX1: number, t0: number, t1: number) {
    let dx = screenX1 - screenX0;
    let dt = t1 - t0;

    let dxdt = dx === 0 || dt === 0 ? 0 : dx / dt;
    dxdt /= 150;

    console.log('dx =', dx, 'dt =', dt, ', dx/dt =', dxdt);

    console.log(this.selectedGroup);
    let group = this.groupMap[this.selectedGroup];

    // resize all views in group accordingly
    let google = group.views[0];
    google.dimension += dxdt;
    let separator = group.views[1];
    // separator.xOffset += dxdt;
    let duckduckgo = group.views[2];
    // duckduckgo.xOffset += dxdt;
    duckduckgo.dimension -= dxdt;

    this.setBounds(google);
    this.setBounds(separator);
    this.setBounds(duckduckgo);
  }
}

export default MainProcess;
