import { BrowserWindow, BrowserView } from 'electron';
import { injects } from './injects';
import { Group, ExtendedView, groups, idToUrl } from '../utils/utils';

type GroupStateMap = {
  loadedInitialURLs: boolean[];
};

const HEADER_SIZE = 76;
const SIDEBAR_SIZE = 0;
const VSEPARATOR_WIDTH = 5;

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
  groupStateMap: { [key: string]: GroupStateMap } = {};

  vSeparatorEntry: string;
  vSeparatorPreload: string;
  hSeparatorEntry: string;
  hSeparatorPreload: string;

  constructor(
    url: string,
    preload: string,
    vSeparatorEntry: string,
    vSeparatorPreload: string,
    hSeparatorEntry: string,
    hSeparatorPreload: string
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

    this.vSeparatorEntry = vSeparatorEntry;
    this.vSeparatorPreload = vSeparatorPreload;
    this.hSeparatorEntry = hSeparatorEntry;
    this.hSeparatorPreload = hSeparatorPreload;
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

      if (extendedView.id === 'vSeparator') {
        leftOffsetAbsolute = width * extendedView.leftOffset;
      }

      if (!extendedView.loadedInitialURL) {
        extendedView.view.webContents.loadURL(
          extendedView.id === 'vSeparator'
            ? this.vSeparatorEntry
            : idToUrl[extendedView.id]
        );

        extendedView.view.webContents.on('did-finish-load', () => {
          extendedView.view.webContents.insertCSS(injects[extendedView.id].css);
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
        this.resizeVerticalSplitScreen(leftOffsetAbsolute, id, false);
        group.views[1].view.webContents.send(
          'windowResize',
          leftOffsetAbsolute
        );
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

  /*
   when should resizeVerticalSplitScreen get called?
      - every time someone drags the vertical bar: shouldSetLeftOffset = true
      - every time someone resizes the main window: shouldSetLeftOffset = false
      - if we change tab and the window size has changed since the last load: shouldSetLeftOffset = false
  */
  resizeVerticalSplitScreen(
    leftOffset: number,
    groupId: string,
    shouldSetLeftOffset: boolean
  ) {
    const [width, _] = this.mainWindow.getSize();

    const w1 = leftOffset;
    const w2 = width - leftOffset;

    let group = this.groupMap[groupId];

    // resize all views in group accordingly
    let vSeparator = group.views[1];
    let leftView = group.views[0];

    leftView.x = 0 / width;
    leftView.y = 0;
    leftView.width = w1 / width;
    leftView.height = 1;

    let rightView = group.views[2];
    rightView.x = Math.round(leftOffset + VSEPARATOR_WIDTH) / width;
    rightView.y = 0;
    rightView.width = Math.round(w2) / width;
    rightView.height = 1;

    if (shouldSetLeftOffset) {
      vSeparator.leftOffset = leftView.width;
    }

    this.setBounds(vSeparator);
    this.setBounds(leftView);
    this.setBounds(rightView);
  }

  resizeHorizontalSplitScreen(topOffset: number, groupId: string) {}
}

export default MainProcess;
