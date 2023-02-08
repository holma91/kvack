import { BrowserWindow, BrowserView } from 'electron';
import {
  Group,
  Settings,
  LiveGroup,
  extensionsById,
  PageView,
  VSeparatorView,
  HSeparatorView,
  SomeView,
} from '../utils/settings';

// const HEADER_SIZE = 76;
const HEADER_SIZE = 94;
const SIDEBAR_SIZE = 0;
const VSEPARATOR_WIDTH_RELATIVE = 0.002;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string; // http://localhost:3000/main_window
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string; // /Users/lapuerta/dev/kvack/desktop/.webpack/renderer/main_window/preload.js
declare const SEARCH_WINDOW_WEBPACK_ENTRY: string;
declare const SEARCH_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
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

class MainProcess {
  mainWindow: BrowserWindow;
  selectedGroup: string = '';
  groupMap: { [key: string]: LiveGroup } = {};
  viewsByGroup: { [key: string]: SomeView[] } = {}; // because we need to know the order when resizing

  constructor(settings: Settings) {
    let window = new BrowserWindow({
      height: settings.windowHeight,
      width: settings.windowWidth,
      frame: true,
      title: 'kvack',
      // type: 'panel',
      webPreferences: {
        preload:
          '/Users/lapuerta/dev/kvack/desktop/.webpack/renderer/main_window/preload.js',
      },
    });

    window.loadURL(SEARCH_WINDOW_WEBPACK_ENTRY);
    this.mainWindow = window;
    // this.groupSettings = ?
  }

  createGroup(group: Group) {
    // const group = this.groupSettings[id];
    let liveGroup: LiveGroup = {
      group: group,
      loadedWidth: 0,
      loadedHeight: 0,
      vSeparators: [],
      hSeparators: [],
      pages: [],
    };
    this.viewsByGroup[group.id] = [];

    let pageCount = 0;
    let vSepCount = 0;
    let hSepCount = 0;

    let numberOfPages = group.positioning.length;
    let numberOfVSeparators = group.layout.filter(
      (type) => type === 'vSeparator'
    ).length;
    let amountToRemoveFromEach =
      (numberOfVSeparators / numberOfPages) * VSEPARATOR_WIDTH_RELATIVE;
    let widths = [
      group.positioning[0] - amountToRemoveFromEach,
      group.positioning[1] - amountToRemoveFromEach,
    ];
    let xOffsets = [0, widths[0] + VSEPARATOR_WIDTH_RELATIVE];
    let vSeparatorLeftOffset = widths[0];

    for (let i = 0; i < group.layout.length; i++) {
      if (group.layout[i] === 'vSeparator') {
        let view = new BrowserView({
          webPreferences: {
            ...defaultViewWebPreferences,
            preload: VSEPARATOR_WINDOW_PRELOAD_WEBPACK_ENTRY,
          },
        });
        liveGroup.vSeparators[vSepCount] = {
          id: group.layout[i],
          width: 1,
          height: 1,
          x: 0,
          y: 0,
          loadedInitialURL: false,
          leftOffset: vSeparatorLeftOffset,
          processId: view.webContents.getProcessId(),
          view,
        };
        view.webContents.focus(); // sometimes necessary?
        this.viewsByGroup[group.id].push(liveGroup.vSeparators[vSepCount]);
        vSepCount++;
      } else if (group.layout[i] === 'hSeparator') {
        // need to change here when we get actual hSeparators
        let view = new BrowserView({
          webPreferences: {
            ...defaultViewWebPreferences,
            preload: HSEPARATOR_WINDOW_PRELOAD_WEBPACK_ENTRY,
          },
        });
        liveGroup.hSeparators[hSepCount] = {
          id: 'hSeparator',
          width: VSEPARATOR_WIDTH_RELATIVE,
          height: 1,
          x: 0,
          y: 0,
          loadedInitialURL: false,
          topOffset: vSeparatorLeftOffset,
          processId: view.webContents.getProcessId(),
          view,
        };
        this.viewsByGroup[group.id].push(liveGroup.hSeparators[hSepCount]);
        hSepCount++;
      } else {
        let extensionId = group.layout[i];
        const extension = extensionsById[extensionId];
        let view = new BrowserView({
          webPreferences: {
            ...defaultViewWebPreferences,
            preload: `/Users/lapuerta/dev/kvack/desktop/.webpack/renderer/${extension.preloadPath}/preload.js`,
          },
        });

        liveGroup.pages[pageCount] = {
          id: group.layout[i], // is the extension id
          width: widths[pageCount],
          height: 1,
          x: xOffsets[pageCount],
          y: 0,
          loadedInitialURL: false,
          processId: view.webContents.getProcessId(),
          view,
        };
        view.webContents.openDevTools();
        this.viewsByGroup[group.id].push(liveGroup.pages[pageCount]);
        pageCount++;
      }
    }

    this.groupMap[group.id] = liveGroup;
  }

  setGroup(group: Group) {
    let liveGroup = this.groupMap[group.id];
    if (!liveGroup) {
      console.log('need to create group before setting group.');
      return;
    }

    const [width, height] = this.mainWindow.getSize();

    let vSeparatorOffsets = liveGroup.vSeparators.map((_) => 0);
    let hSeparatorOffsets = liveGroup.hSeparators.map((_) => 0);

    for (let i = 0; i < liveGroup.vSeparators.length; i++) {
      let vSeparatorView = liveGroup.vSeparators[i];

      if (i === 0) {
        this.mainWindow.setBrowserView(vSeparatorView.view);
      } else {
        this.mainWindow.addBrowserView(vSeparatorView.view);
      }

      let leftOffsetAbsolute = width * vSeparatorView.leftOffset;

      vSeparatorOffsets[i] = leftOffsetAbsolute;

      if (!vSeparatorView.loadedInitialURL) {
        vSeparatorView.view.webContents.loadURL(
          VSEPARATOR_WINDOW_WEBPACK_ENTRY
        );

        vSeparatorView.view.webContents.on('did-finish-load', () => {
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

    for (let i = 0; i < liveGroup.pages.length; i++) {
      let pageView = liveGroup.pages[i];

      if (
        liveGroup.vSeparators.length === 0 &&
        liveGroup.hSeparators.length === 0 &&
        i === 0
      ) {
        this.mainWindow.setBrowserView(pageView.view);
      } else {
        this.mainWindow.addBrowserView(pageView.view);
      }

      if (!pageView.loadedInitialURL) {
        const extension = extensionsById[pageView.id];
        pageView.view.webContents.loadURL(extension.entryUrl);
        pageView.loadedInitialURL = true;
        this.setBounds(pageView);
      }

      if (
        width !== liveGroup.loadedWidth ||
        height !== liveGroup.loadedHeight
      ) {
        // will get here if window size has changed but the group was loaded earlier
        if (
          liveGroup.vSeparators.length === 0 &&
          liveGroup.hSeparators.length === 0
        ) {
          // look here closer
          this.setBounds(pageView);
        }
      }
    }

    if (width !== liveGroup.loadedWidth || height !== liveGroup.loadedHeight) {
      for (let i = 0; i < liveGroup.vSeparators.length; i++) {
        let processId = liveGroup.vSeparators[i].processId;
        this.resizeVerticalSplitScreenFromWindowChange(group.id, processId);

        liveGroup.vSeparators[i].view.webContents.send(
          'windowResize',
          vSeparatorOffsets[i]
        );
      }
    }

    liveGroup.loadedHeight = height;
    liveGroup.loadedWidth = width;
    this.selectedGroup = group.id;
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

    let vSeparator = views[index] as VSeparatorView;
    let leftView = views[index - 1] as PageView;
    let rightView = views[index + 1] as PageView;

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

    let vSeparator = views[index] as VSeparatorView;
    let leftView = views[index - 1] as PageView;
    let rightView = views[index + 1] as PageView;

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
