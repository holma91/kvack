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
};

type SomeView = PageView | VSeparatorView | HSeparatorView;

const groups: { [key: string]: Group } = {
  // google: {
  //   id: 'google',
  //   short: 'g',
  //   extensions: ['google'],
  //   separators: [],
  //   loadedHeight: 0,
  //   loadedWidth: 0,
  //   views: [
  //     {
  //       id: 'google',
  //       width: 1,
  //       height: 1,
  //       x: 0,
  //       y: 0,
  //       loadedInitialURL: false,
  //     },
  //   ],
  // },
  // duckduckgo: {
  //   id: 'duckduckgo',
  //   short: 'd',
  //   extensions: ['duckduckgo'],
  //   separators: [],
  //   loadedHeight: 0,
  //   loadedWidth: 0,
  //   views: [
  //     {
  //       id: 'duckduckgo',
  //       width: 1,
  //       height: 1,
  //       x: 0,
  //       y: 0,
  //       loadedInitialURL: false,
  //     },
  //   ],
  // },
  chatgpt: {
    id: 'chatgpt',
    short: 'c',
    extensions: ['chatgpt'],
    loadedHeight: 0,
    loadedWidth: 0,
    vSeparators: [],
    hSeparators: [],
    positioning: ['page'],
    pages: [
      {
        id: 'chatgpt',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
      },
    ],
  },
  'google-duckduckgo': {
    id: 'google-duckduckgo',
    short: 'gd',
    extensions: ['google', 'duckduckgo'],
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
      },
    ],
    hSeparators: [],
    pages: [
      {
        id: 'google',
        width: 0.5,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
      },
      {
        id: 'duckduckgo',
        width: 0.49,
        height: 1,
        x: 0.51,
        y: 0,
        loadedInitialURL: false,
      },
    ],
  },
  'google-chatgpt': {
    id: 'google-chatgpt',
    short: 'gc',
    extensions: ['google', 'chatgpt', 'duckduckgo'],
    loadedHeight: 0,
    loadedWidth: 0,
    positioning: ['page', 'vSeparator', 'page', 'vSeparator', 'page'],
    vSeparators: [
      {
        id: 'vSeparator',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        leftOffset: 0.3,
      },
      {
        id: 'vSeparator',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        leftOffset: 0.6,
      },
    ],
    hSeparators: [],
    pages: [
      {
        id: 'google',
        width: 0.3,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
      },
      {
        id: 'chatgpt',
        width: 0.29,
        height: 1,
        x: 0.31,
        y: 0,
        loadedInitialURL: false,
      },
      {
        id: 'duckduckgo',
        width: 0.39,
        height: 1,
        x: 0.61,
        y: 0,
        loadedInitialURL: false,
      },
    ],
  },
  // wikipedia: {
  //   id: 'wikipedia',
  //   short: 'w',
  //   extensions: ['wikipedia', 'wikipedia'],
  //   loadedHeight: 0,
  //   loadedWidth: 0,
  //   views: [
  //     {
  //       id: 'wikipedia',
  //       width: 0.5,
  //       height: 1,
  //       x: 0,
  //       y: 0,
  //       loadedInitialURL: false,
  //     },
  //     {
  //       id: 'vSeparator',
  //       width: 1,
  //       height: 1,
  //       x: 0,
  //       y: 0,
  //       loadedInitialURL: false,
  //       leftOffset: 0.5,
  //     },
  //     {
  //       id: 'wikipedia',
  //       width: 0.49,
  //       height: 1,
  //       x: 0.51,
  //       y: 0,
  //       loadedInitialURL: false,
  //     },
  //   ],
  // },
};

const idToUrl: { [keheight: string]: string } = {
  // google: 'https://google.com',
  google: 'https://brave.com',
  duckduckgo: 'https://duckduckgo.com',
  wolframalpha: 'https://wolframalpha.com',
  // chatgpt: 'https://chat.openai.com',
  chatgpt: 'https://microsoft.com',
  bing: 'https://bing.com',
  vSeparator: 'https://google.com',
  wikipedia: 'https://wikipedia.com',
};

export {
  extensions,
  groups,
  idToUrl,
  Group,
  PageView,
  VSeparatorView,
  HSeparatorView,
  SomeView,
};
