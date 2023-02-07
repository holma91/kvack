import { BrowserView } from 'electron';

type Settings = {
  userId: string;
  windowWidth: number;
  windowHeight: number;
  downloadedExtensions: string[];
  groups: { [key: string]: Group };
};

type Extension = {
  id: string;
  entryUrl: string;
  preloadPath: string;
};

type Group = {
  id: string;
  shortId: string;
  extensions: string[];
  layout: string[];
  positioning: number[];
};

type LiveGroup = {
  group: Group;
  loadedWidth: number;
  loadedHeight: number;
  vSeparators: VSeparatorView[];
  hSeparators: HSeparatorView[];
  pages: PageView[];
};

type PageView = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  view: BrowserView;
  processId: number;
};

type VSeparatorView = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  view: BrowserView;
  processId: number;
  leftOffset: number;
};

type HSeparatorView = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  view: BrowserView;
  processId: number;
  topOffset: number;
};

type SomeView = PageView | VSeparatorView | HSeparatorView;

const google: Extension = {
  id: 'google',
  // entryUrl: 'https://www.google.com/',
  entryUrl: 'https://www.google.com/search?q=something',
  preloadPath: 'google_results_window',
};

const duckduckgo: Extension = {
  id: 'duckduckgo',
  // entryUrl: 'https://duckduckgo.com/',
  entryUrl: 'https://duckduckgo.com/?q=something',
  preloadPath: 'duckduckgo_results_window',
};

const extensionsById: { [key: string]: Extension } = {
  google,
  duckduckgo,
};

const defaultSettings: Settings = {
  userId: 'lapuerta',
  windowWidth: 1450,
  windowHeight: 800,
  downloadedExtensions: ['google', 'duckduckgo'],
  groups: {
    google: {
      id: 'google',
      shortId: 'g',
      extensions: ['google'],
      layout: ['google'],
      positioning: [1],
    },
    'google-duckduckgo': {
      id: 'google-duckduckgo',
      shortId: 'gd',
      extensions: ['google', 'duckduckgo'],
      layout: ['google', 'vSeparator', 'duckduckgo'],
      positioning: [0.5, 0.5],
    },
  },
};

export {
  defaultSettings,
  Settings,
  Group,
  LiveGroup,
  extensionsById,
  PageView,
  VSeparatorView,
  HSeparatorView,
  SomeView,
};
