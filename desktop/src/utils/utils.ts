import { BrowserView } from 'electron';
const extensions = ['google', 'duckduckgo', 'wolframalpha', 'chatgpt', 'bing'];

type Group = {
  id: string;
  short: string;
  extensions: string[];
  positioning: ('page' | 'hSeparator' | 'vSeparator')[];
  vSeparators: VSeparatorView[];
  hSeparators: HSeparatorView[];
  pages: PageView[];
  loadedHeight: number;
  loadedWidth: number;
};

// hSeparatorView, vSeparatorView and pageView
type PageView = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  view?: BrowserView;
  processId?: number;
  preload?: string;
};

type VSeparatorView = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  view?: BrowserView;
  processId?: number;
  leftOffset?: number;
  preload?: string;
};

type HSeparatorView = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  view?: BrowserView;
  processId?: number;
  topOffset?: number;
  preload?: string;
};

type SomeView = PageView | VSeparatorView | HSeparatorView;

const groups2: { [key: string]: Group } = {
  'google-duckduckgo': {
    id: 'google-duckduckgo',
    short: 'gd',
    extensions: ['googleResults', 'duckduckgoResults'],
    loadedHeight: 0,
    loadedWidth: 0,
    positioning: ['page', 'vSeparator', 'page'],
    vSeparators: [
      {
        id: 'vSeparator',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        leftOffset: 0.5,
        preload: 'main_window/preload.js',
      },
    ],
    hSeparators: [],
    pages: [
      {
        id: 'googleResults',
        width: 0.5,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        preload: 'google_results_window/preload.js',
      },
      {
        id: 'duckduckgoResults',
        width: 0.498,
        height: 1,
        x: 0.502,
        y: 0,
        loadedInitialURL: false,
        preload: 'duckduckgo_results_window/preload.js',
      },
    ],
  },
};

const groups3: { [key: string]: Group } = {
  google: {
    id: 'google',
    short: 'gd',
    extensions: ['googleResults'],
    loadedHeight: 0,
    loadedWidth: 0,
    positioning: ['page'],
    vSeparators: [],
    hSeparators: [],
    pages: [
      {
        id: 'googleResults',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        preload: 'google_results_window/preload.js',
      },
    ],
  },
};

const idToUrl: { [keheight: string]: string } = {
  googleSearch: 'https://google.com',
  googleResults:
    'https://www.google.com/search?q=how+to+change+background+color',
  // google: 'https://brave.com',
  duckduckgo: 'https://duckduckgo.com',
  duckduckgoResults: 'https://duckduckgo.com/?q=how+to+do+x&t=h_&ia=web',
  // duckduckgo: 'https://chat.openai.com',
  wolframalpha: 'https://wolframalpha.com',
  // chatgpt: 'https://chat.openai.com',
  chatgpt: 'https://microsoft.com',
  bing: 'https://bing.com',
  vSeparator: 'https://google.com',
  wikipedia: 'https://wikipedia.com',
};

export {
  extensions,
  groups2,
  groups3,
  idToUrl,
  Group,
  PageView,
  VSeparatorView,
  HSeparatorView,
  SomeView,
};
