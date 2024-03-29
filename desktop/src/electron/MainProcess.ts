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
import {
  HEADER_SIZE,
  SIDEBAR_SIZE,
  VSEPARATOR_WIDTH_RELATIVE,
} from '../constants';

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
  showSidebar: boolean = true;
  sidebarToggleCount = 0;

  constructor(settings: Settings) {
    let window = new BrowserWindow({
      height: settings.windowHeight,
      width: settings.windowWidth,
      x: 30,
      y: 75,
      frame: false, // use -webkit-app-region: drag;
      title: 'kvack',
      type: 'panel',
      webPreferences: {
        preload:
          '/Users/lapuerta/dev/kvack/desktop/.webpack/renderer/main_window/preload.js',
      },
    });

    window.loadURL(SEARCH_WINDOW_WEBPACK_ENTRY);
    window.webContents.on('did-finish-load', () => {
      window.webContents.send('groupsChange', Object.keys(settings.groups));
    });
    this.mainWindow = window;
    this.mainWindow.webContents.setMaxListeners(30);

    // window.webContents.openDevTools({ mode: 'detach' });
  }

  createGroup(group: Group) {
    // const group = this.groupSettings[id];
    let liveGroup: LiveGroup = {
      group: group,
      loadedWidth: 0,
      loadedHeight: 0,
      loadedSidebarToggleCount: this.sidebarToggleCount,
      vSeparators: [],
      hSeparators: [],
      pages: [],
      tabs: [], // length = group.layout.length
      selectedTab: 0,
    };
    this.viewsByGroup[group.id] = [];

    for (let h = 0; h < group.layout.length; h++) {
      let pageCount = 0;
      let vSepCount = 0;
      let hSepCount = 0;
      liveGroup.tabs[h] = [];

      let numberOfPages = group.positioning[h].length; // number of tabs
      let numberOfVSeparators = group.layout[h].filter(
        (type) => type === 'vSeparator'
      ).length;

      let amountToRemoveFromEach =
        (numberOfVSeparators / numberOfPages) * VSEPARATOR_WIDTH_RELATIVE;

      let widths: number[] = [];
      group.positioning[h].forEach((pos, i) => {
        widths[i] = pos - amountToRemoveFromEach;
      });
      // let widths = [
      //   group.positioning[h][0] - amountToRemoveFromEach,
      //   group.positioning[h][1] - amountToRemoveFromEach,
      // ];
      let xOffsets = [0, widths[0] + VSEPARATOR_WIDTH_RELATIVE]; // ?
      let vSeparatorLeftOffset = widths[0];

      for (let i = 0; i < group.layout[h].length; i++) {
        if (group.layout[h][i] === 'vSeparator') {
          let view = new BrowserView({
            webPreferences: {
              ...defaultViewWebPreferences,
              preload: VSEPARATOR_WINDOW_PRELOAD_WEBPACK_ENTRY,
            },
          });
          liveGroup.vSeparators[vSepCount] = {
            id: group.layout[h][i],
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
          liveGroup.tabs[h].push(liveGroup.vSeparators[vSepCount]);
          vSepCount++;
        } else if (group.layout[h][i] === 'hSeparator') {
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
          let extensionId = group.layout[h][i];
          const extension = extensionsById[extensionId];
          let view = new BrowserView({
            webPreferences: {
              ...defaultViewWebPreferences,
              preload: `/Users/lapuerta/dev/kvack/desktop/.webpack/renderer/${extension.preloadPath}/preload.js`,
            },
          });

          liveGroup.pages[pageCount] = {
            id: group.layout[h][i], // is the extension id
            width: widths[pageCount],
            height: 1,
            x: xOffsets[pageCount],
            y: 0,
            loadedInitialURL: false,
            processId: view.webContents.getProcessId(),
            view,
            // url: extension.entryUrl
          };
          if (group.layout[h][i] === 'twitter') {
            // view.webContents.openDevTools();
          }
          this.viewsByGroup[group.id].push(liveGroup.pages[pageCount]);
          liveGroup.tabs[h].push(liveGroup.pages[pageCount]);

          pageCount++;
        }
      }
    }

    this.groupMap[group.id] = liveGroup;
  }

  loadURL(view: SomeView, url: string) {
    view.view.webContents.loadURL(url);
    view.loadedInitialURL = true;

    let processId = view.view.webContents.getProcessId();
    view.view.webContents.on('did-navigate', (event, url) => {
      // console.log('processId:', processId, 'did-navigate:', url);
      this.mainWindow.webContents.send('urlChange', url, processId);
    });
    view.view.webContents.on('did-navigate-in-page', (event, url) => {
      // console.log('processId:', processId, 'did-navigate-in-page:', url);
      this.mainWindow.webContents.send('urlChange', url, processId);
    });
  }

  setTab(views: SomeView[]) {
    for (let i = 0; i < views.length; i++) {
      if (views[i].id === 'vSeparator') {
      } else if (views[i].id === 'hSeparator') {
      } else {
        this.mainWindow.setBrowserView(views[i].view);
        const extension = extensionsById[views[i].id];
        if (!views[i].loadedInitialURL) {
          this.loadURL(views[i], extension.entryUrl);
        }
        this.setBounds(views[i]);
      }
    }
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

      const computedSidebarWidth = this.showSidebar ? SIDEBAR_SIZE : 0;
      const appOffsetX = computedSidebarWidth;
      const appSpaceX = width - appOffsetX;
      let leftOffsetAbsolute = appSpaceX * vSeparatorView.leftOffset;

      vSeparatorOffsets[i] = leftOffsetAbsolute;

      if (!vSeparatorView.loadedInitialURL) {
        this.loadURL(vSeparatorView, VSEPARATOR_WINDOW_WEBPACK_ENTRY);

        vSeparatorView.view.webContents.on('did-finish-load', () => {
          vSeparatorView.view.webContents.send(
            'windowResize',
            leftOffsetAbsolute
          );
        });

        vSeparatorView.loadedInitialURL = true; // change
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
        this.loadURL(pageView, extension.entryUrl);
        if (pageView.id === 'google') {
          // pageView.view.webContents.openDevTools();
          pageView.view.webContents.on('did-navigate-in-page', (event, url) => {
            // so here we can keep track of the url
            // - change it on the view, and send it to the sidebar
            // console.log(`Navigated to ${url}`);
          });
        }
        pageView.loadedInitialURL = true;
        this.setBounds(pageView);
      }

      // check for "loaded sidebar preference here"
      if (
        width !== liveGroup.loadedWidth ||
        height !== liveGroup.loadedHeight ||
        this.sidebarToggleCount !== liveGroup.loadedSidebarToggleCount
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

    if (
      width !== liveGroup.loadedWidth ||
      height !== liveGroup.loadedHeight ||
      this.sidebarToggleCount !== liveGroup.loadedSidebarToggleCount
    ) {
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
    liveGroup.loadedSidebarToggleCount = this.sidebarToggleCount;

    let tabIds = liveGroup.tabs
      .map((outer) =>
        outer
          .filter((tab) => tab.id !== 'vSeparator')
          .map((tab) => tab.processId)
      )
      .flat();
    // console.log(tabIds);

    this.mainWindow.webContents.on('did-finish-load', () => {
      this.mainWindow.webContents.send('selectedGroupChange', group.id, tabIds);
    });
    // when it's not the initial load
    this.mainWindow.webContents.send('selectedGroupChange', group.id, tabIds);

    this.selectedGroup = group.id;
  }

  setBounds(extendedView: SomeView) {
    const [width, height] = this.mainWindow.getSize();
    const [_, contentHeight] = this.mainWindow.getContentSize();
    const topFrame = height - contentHeight;

    const computedSidebarWidth = this.showSidebar ? SIDEBAR_SIZE : 0;

    const appOffsetY = HEADER_SIZE + topFrame;
    const appSpaceY = height - appOffsetY;

    const appOffsetX = computedSidebarWidth;
    const appSpaceX = width - appOffsetX;

    // bounds values MUST be positive integers
    let bounds = {
      // x: Math.round(width * extendedView.x),
      x: Math.round(appOffsetX + appSpaceX * extendedView.x),
      y: Math.round(appOffsetY + appSpaceY * extendedView.y),
      width: Math.round(appSpaceX * extendedView.width),
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
    let [width, _] = this.mainWindow.getSize();

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

    const computedSidebarWidth = this.showSidebar ? SIDEBAR_SIZE : 0;
    const appOffsetX = computedSidebarWidth;
    const appSpaceX = width - appOffsetX;
    width = appSpaceX;

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
