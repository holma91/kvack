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
          label: 'Select Next Tab',
          accelerator: 'Ctrl+Tab',
          click: () => {
            mainProcess.mainWindow.webContents.send('nextTab');
          },
        },
        {
          label: 'Select Previous Tab',
          accelerator: 'Ctrl+Shift+Tab',
          click: () => {
            mainProcess.mainWindow.webContents.send('previousTab');
          },
        },
        {
          label: 'Show/Hide Sidebar',
          accelerator: 'Cmd+B',
          click: () => {
            if (mainProcess.showSidebar) {
              mainProcess.mainWindow.webContents.send('hideSidebar');
            } else {
              mainProcess.mainWindow.webContents.send('showSidebar');
            }

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
    const liveGroup = mainProcess.groupMap[groupId];
    mainProcess.setGroup(liveGroup.group);
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
