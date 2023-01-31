import {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  webContents,
  Menu,
  MenuItem,
  globalShortcut,
} from 'electron';
import path from 'path';
import MainProcess from './CustomWindow';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string; // http://localhost:3000/main_window
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string; // /Users/lapuerta/dev/kvack/desktop/.webpack/renderer/main_window/preload.js

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function sendIPCToWindow(window: any, action: string, data: any) {
  window.webContents.send(action, data || {});
}

const defaultExtensions = [
  'google',
  'duckduckgo',
  'wolframalpha',
  'chatgpt',
  'bing',
];

const start = (): void => {
  const mainProcess = new MainProcess(
    MAIN_WINDOW_WEBPACK_ENTRY,
    MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
  );
  for (const id of defaultExtensions.reverse()) {
    // load everything into the cache on startup
    mainProcess.createView(id);
    mainProcess.setView(id);
  }
  // mainProcess.mainWindow.webContents.openDevTools();
  // console.log(mainProcess.viewMap['google'].webContents);
  console.log(ipcMain);

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

  ipcMain.on('setView', (e: any, viewId: string) => {
    mainProcess.setView(viewId);
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
