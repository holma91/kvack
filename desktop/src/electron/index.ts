import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  globalShortcut,
} from 'electron';
import MainProcess from './MainProcess';
import { defaultSettings } from '../utils/settings';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const start = (): void => {
  const settings = defaultSettings;
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
      ],
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
    const views = mainProcess.viewsByGroup[mainProcess.selectedGroup];
    for (const extendedView of views) {
      extendedView.view.webContents.send('searchInput', input);
    }
  });

  mainProcess.mainWindow.on('will-resize', function (_, newBounds, __) {
    const groupString = mainProcess.selectedGroup;
    const group = mainProcess.groupMap[groupString];

    group.vSeparators.forEach((vSeparatorView) => {
      const leftOffsetAbsolute = newBounds.width * vSeparatorView.leftOffset;
      vSeparatorView.view.webContents.send('windowResize', leftOffsetAbsolute);

      let processId = vSeparatorView.view.webContents.getProcessId();
      mainProcess.resizeVerticalSplitScreenFromWindowChange(
        groupString,
        processId
      );
    });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  globalShortcut.register('Alt+CommandOrControl+K', () => {
    console.log('Electron loves global shortcuts!');
  });
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
