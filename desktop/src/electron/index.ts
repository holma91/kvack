import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  globalShortcut,
  session,
} from 'electron';

import path from 'path';
import MainProcess from './MainProcess';
import {
  HEADER_SIZE,
  SIDEBAR_SIZE,
  VSEPARATOR_WIDTH_RELATIVE,
} from '../constants';
import { settings, VSeparatorView } from '../utils/settings';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const start = (): void => {
  // const secondProcess = new MainProcess(settings);
  const mainProcess = new MainProcess(settings);

  // read the settings, load up all the groups
  for (const id of Object.keys(settings.groups)) {
    // load everything into the cache on startup
    mainProcess.createGroup(settings.groups[id]);
    mainProcess.setGroup(settings.groups[id]);
  }

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: 'Tab',
      submenu: [
        {
          label: 'Next Group',
          accelerator: 'CmdOrCtrl+]',
          click: () => {
            let groupsInOrder = Object.keys(settings.groups); // change to map later to 100% guarantee order
            let indexOfNextGroup =
              groupsInOrder.indexOf(mainProcess.selectedGroup) + 1;
            let nextGroupId =
              groupsInOrder[
                indexOfNextGroup >= groupsInOrder.length ? 0 : indexOfNextGroup
              ];

            const nextLiveGroup = mainProcess.groupMap[nextGroupId];
            mainProcess.setGroup(nextLiveGroup.group);
          },
        },
        {
          label: 'Previous Group',
          accelerator: 'CmdOrCtrl+[',
          click: () => {
            let groupsInOrder = Object.keys(settings.groups); // change to map later to 100% guarantee order
            let indexOfNextGroup =
              groupsInOrder.indexOf(mainProcess.selectedGroup) - 1;
            let nextGroupId =
              groupsInOrder[
                indexOfNextGroup >= 0
                  ? indexOfNextGroup
                  : groupsInOrder.length - 1
              ];
            const nextLiveGroup = mainProcess.groupMap[nextGroupId];
            mainProcess.setGroup(nextLiveGroup.group);
          },
        },
        {
          label: 'Select Next Tab',
          accelerator: 'Ctrl+Tab',
          click: () => {
            let group = mainProcess.groupMap[mainProcess.selectedGroup];
            if (group.tabs.length === 1) return;

            group.selectedTab = (group.selectedTab + 1) % group.tabs.length;
            let nextTab = group.tabs[group.selectedTab];
            mainProcess.setTab(nextTab);

            mainProcess.mainWindow.webContents.send(
              'selectedTabChange',
              group.selectedTab
            );
          },
        },
        {
          label: 'Select Previous Tab',
          accelerator: 'Ctrl+Shift+Tab',
          click: () => {
            let group = mainProcess.groupMap[mainProcess.selectedGroup];
            if (group.tabs.length === 1) return;
            group.selectedTab =
              group.selectedTab < 1
                ? group.tabs.length - 1
                : group.selectedTab - 1;

            let previousTab = group.tabs[group.selectedTab];
            mainProcess.setTab(previousTab);

            mainProcess.mainWindow.webContents.send(
              'selectedTabChange',
              group.selectedTab
            );
          },
        },
        {
          label: 'Show/Hide Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainProcess.mainWindow.webContents.send(
              'showSidebarChange',
              !mainProcess.showSidebar
            );

            mainProcess.sidebarToggleCount += 1;
            mainProcess.showSidebar = !mainProcess.showSidebar;
            // const views = mainProcess.viewsByGroup[groupString];
            // should go through all views, not just current group's views
            for (let views of Object.values(mainProcess.viewsByGroup)) {
              for (let view of views) {
                mainProcess.setBounds(view);
                if (view.id === 'vSeparator') {
                  const separatorView = view as VSeparatorView;
                  const [width, _] = mainProcess.mainWindow.getSize();
                  const computedSidebarWidth = mainProcess.showSidebar
                    ? SIDEBAR_SIZE
                    : 0;
                  const appOffsetX = computedSidebarWidth;
                  const appSpaceX = width - appOffsetX;
                  const leftOffsetAbsolute =
                    appSpaceX * separatorView.leftOffset;
                  separatorView.view.webContents.send(
                    'windowResize',
                    leftOffsetAbsolute
                  );
                }
              }
            }
          },
        },
        {
          label: 'Hide App',
          accelerator: 'Esc',
          click: () => {
            mainProcess.mainWindow.hide();
          },
        },
      ],
    })
  );
  menu.append(
    new MenuItem({
      role: 'editMenu',
    })
  );
  Menu.setApplicationMenu(menu);

  ipcMain.on('setGroup', (e: any, groupId: string) => {
    // will be helpful later when user can click on group in sidebar
    // const liveGroup = mainProcess.groupMap[groupId];
    // mainProcess.setGroup(liveGroup.group);
  });

  ipcMain.on('resize-bar', (e, leftOffset) => {
    const groupString = mainProcess.selectedGroup;
    // here the position of ONLY one separator will change
    // find the separator by process ID
    mainProcess.resizeVerticalSplitScreenFromBarChange(
      leftOffset,
      groupString,
      e.processId
    );
  });

  ipcMain.on('searchInput', (e, input) => {
    // selectedGroup should just be the latest typed bang?
    // always check the bangs
    // assert that the currently viewed group is the group specified by the bangs
    // find group by bangs
    // send input to the views in the group
    // mainProcess.mainWindow.webContents.send('nextGroup');
    const views = mainProcess.viewsByGroup[mainProcess.selectedGroup];
    for (const extendedView of views) {
      extendedView.view.webContents.send('searchInput', input);
    }
  });

  mainProcess.mainWindow.on('will-resize', function (_, newBounds, __) {
    const groupString = mainProcess.selectedGroup;
    const group = mainProcess.groupMap[groupString];
    const computedSidebarWidth = mainProcess.showSidebar ? SIDEBAR_SIZE : 0;
    const appOffsetX = computedSidebarWidth;
    const appSpaceX = newBounds.width - appOffsetX;

    group.vSeparators.forEach((vSeparatorView) => {
      const leftOffsetAbsolute = appSpaceX * vSeparatorView.leftOffset;
      vSeparatorView.view.webContents.send('windowResize', leftOffsetAbsolute);

      let processId = vSeparatorView.view.webContents.getProcessId();
      mainProcess.resizeVerticalSplitScreenFromWindowChange(
        groupString,
        processId
      );
    });
  });

  mainProcess.mainWindow.on('enter-full-screen', function () {
    console.log('fs');
  });

  globalShortcut.register('Cmd+M', () => {
    if (mainProcess.mainWindow.isFocused()) {
      mainProcess.mainWindow.hide();
    } else {
      mainProcess.mainWindow.show();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  start();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    start();
  }
});
