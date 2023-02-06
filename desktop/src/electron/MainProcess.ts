import { BrowserWindow, BrowserView } from 'electron';
import { injects } from './injects';
import {
  Group,
  groups,
  idToUrl,
  PageView,
  VSeparatorView,
  HSeparatorView,
  SomeView,
} from '../utils/utils';

// const HEADER_SIZE = 76;
const HEADER_SIZE = 94;
const SIDEBAR_SIZE = 0;
const VSEPARATOR_WIDTH_RELATIVE = 0.002;

declare const VSEPARATOR_WINDOW_WEBPACK_ENTRY: string;
declare const VSEPARATOR_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const HSEPARATOR_WINDOW_WEBPACK_ENTRY: string;
declare const HSEPARATOR_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

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
  selectedGroup: string = '';
  groupMap: { [key: string]: Group } = {};
  viewsByGroup: { [key: string]: SomeView[] } = {};

  vSeparatorEntry: string;
  vSeparatorPreload: string;
  hSeparatorEntry: string;
  hSeparatorPreload: string;

  constructor(url: string, preload: string) {
    let window = new BrowserWindow({
      height: 800,
      width: 1450,
      frame: true,
      title: 'kvack',
      // type: 'panel',
      webPreferences: {
        preload,
      },
    });
    // window.setPosition(25, 100); // use when frame: false
    window.loadURL(url);
    this.mainWindow = window;

    this.vSeparatorEntry = VSEPARATOR_WINDOW_WEBPACK_ENTRY;
    this.vSeparatorPreload = VSEPARATOR_WINDOW_PRELOAD_WEBPACK_ENTRY;
    this.hSeparatorEntry = HSEPARATOR_WINDOW_WEBPACK_ENTRY;
    this.hSeparatorPreload = HSEPARATOR_WINDOW_PRELOAD_WEBPACK_ENTRY;
  }

  createGroup(id: string) {
    const group = groups[id];
    this.viewsByGroup[id] = [];

    let pageCount = 0;
    let vSepCount = 0;
    let hSepCount = 0;
    for (let i = 0; i < group.positioning.length; i++) {
      let view = new BrowserView({
        webPreferences: defaultViewWebPreferences,
      });

      let processId = view.webContents.getProcessId();

      if (group.positioning[i] === 'page') {
        group.pages[pageCount].view = view;
        group.pages[pageCount].processId = processId;
        this.viewsByGroup[id].push(group.pages[pageCount]);
        pageCount++;
      } else if (group.positioning[i] === 'vSeparator') {
        group.vSeparators[vSepCount].view = view;
        group.vSeparators[vSepCount].processId = processId;
        this.viewsByGroup[id].push(group.vSeparators[vSepCount]);
        vSepCount++;
      } else {
        group.hSeparators[hSepCount].view = view;
        group.hSeparators[hSepCount].processId = processId;
        this.viewsByGroup[id].push(group.hSeparators[hSepCount]);
        hSepCount++;
      }
    }

    this.groupMap[id] = group;
  }

  setGroup(id: string) {
    let group = this.groupMap[id];
    if (!group) return;

    const [width, height] = this.mainWindow.getSize();

    let vSeparatorOffsets = group.vSeparators.map((_) => 0);
    let hSeparatorOffsets = group.hSeparators.map((_) => 0);

    for (let i = 0; i < group.vSeparators.length; i++) {
      let vSeparatorView = group.vSeparators[i];

      if (i === 0) {
        this.mainWindow.setBrowserView(vSeparatorView.view);
      } else {
        this.mainWindow.addBrowserView(vSeparatorView.view);
      }

      let leftOffsetAbsolute = width * vSeparatorView.leftOffset;
      vSeparatorOffsets[i] = leftOffsetAbsolute;

      if (!vSeparatorView.loadedInitialURL) {
        vSeparatorView.view.webContents.loadURL(this.vSeparatorEntry);
        vSeparatorView.view.webContents.on('did-finish-load', () => {
          vSeparatorView.view.webContents.insertCSS(injects['vSeparator'].css);
          vSeparatorView.view.webContents.send(
            'windowResize',
            leftOffsetAbsolute
          );
        });

        vSeparatorView.loadedInitialURL = true;
        this.setBounds(vSeparatorView);
      }
    }

    // do the same for hSeparators

    for (let i = 0; i < group.pages.length; i++) {
      let pageView = group.pages[i];
      if (
        group.vSeparators.length === 0 &&
        group.hSeparators.length === 0 &&
        i === 0
      ) {
        this.mainWindow.setBrowserView(pageView.view);
      } else {
        this.mainWindow.addBrowserView(pageView.view);
      }

      if (!pageView.loadedInitialURL) {
        pageView.view.webContents.loadURL(idToUrl[pageView.id]);
        pageView.view.webContents.on('did-finish-load', () => {
          pageView.view.webContents.insertCSS(injects[pageView.id].css);
        });

        pageView.loadedInitialURL = true;
        this.setBounds(pageView);
      }

      if (width !== group.loadedWidth || height !== group.loadedHeight) {
        // will get here if window size has changed but the group was loaded earlier
        if (group.vSeparators.length === 0 && group.hSeparators.length === 0) {
          this.setBounds(pageView);
        }
      }
    }

    if (width !== group.loadedWidth || height !== group.loadedHeight) {
      for (let i = 0; i < group.vSeparators.length; i++) {
        let processId = group.vSeparators[i].processId;
        this.resizeVerticalSplitScreenFromWindowChange(id, processId);

        group.vSeparators[i].view.webContents.send(
          'windowResize',
          vSeparatorOffsets[i]
        );
      }
    }

    group.loadedHeight = height;
    group.loadedWidth = width;
    this.selectedGroup = id;
  }

  setBounds(extendedView: SomeView) {
    const [width, height] = this.mainWindow.getSize();
    const [_, contentHeight] = this.mainWindow.getContentSize();
    const topFrame = height - contentHeight;

    const appOffsetY = HEADER_SIZE + topFrame;
    const appSpaceY = height - appOffsetY;

    // bounds values MUST be positive integers
    let bounds = {
      x: Math.round(width * extendedView.x),
      y: Math.round(appOffsetY + appSpaceY * extendedView.y),
      width: Math.round(width * extendedView.width),
      height: Math.round(appSpaceY * extendedView.height),
    };

    extendedView.view.setBounds(bounds);
    extendedView.view.setAutoResize({
      width: true,
      horizontal: true,
    });
  }

  resizeVerticalSplitScreenFromWindowChange(
    groupId: string,
    processId: number
  ) {
    let views = this.viewsByGroup[groupId];

    let index = -1;
    for (let i = 0; i < views.length; i++) {
      if (views[i].processId === processId) {
        index = i;
        break;
      }
    }

    let vSeparator: VSeparatorView = views[index];
    let leftView: PageView = views[index - 1];
    let rightView: PageView = views[index + 1];

    this.setBounds(vSeparator);
    this.setBounds(leftView);
    this.setBounds(rightView);
  }

  resizeVerticalSplitScreenFromBarChange(
    leftOffset: number,
    groupId: string,
    processId: number
  ) {
    const [width, _] = this.mainWindow.getSize();

    let views = this.viewsByGroup[groupId];

    let index = -1;
    for (let i = 0; i < views.length; i++) {
      if (views[i].processId === processId) {
        index = i;
        break;
      }
    }

    let vSeparator: VSeparatorView = views[index];
    let leftView: PageView = views[index - 1];
    let rightView: PageView = views[index + 1];

    const w1 = leftOffset;
    const w2 = width - leftOffset;

    leftView.x = leftView.x / width;
    leftView.y = 0;
    leftView.width = w1 / width;
    leftView.height = 1;

    let vSepWidth = VSEPARATOR_WIDTH_RELATIVE * width;

    rightView.x = Math.round(leftOffset + vSepWidth) / width;
    rightView.y = 0;
    rightView.width = w2 / width;
    rightView.height = 1;

    vSeparator.leftOffset = leftView.width;

    this.setBounds(vSeparator);
    this.setBounds(leftView);
    this.setBounds(rightView);
  }

  resizeHorizontalSplitScreen(
    topOffset: number,
    groupId: string,
    processId: number,
    shouldSetTopOffset: boolean
  ) {}
}

export default MainProcess;