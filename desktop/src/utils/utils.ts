import { BrowserView } from 'electron';
const extensions = ['google', 'duckduckgo', 'wolframalpha', 'chatgpt', 'bing'];

type Group = {
  id: string;
  short: string;
  extensions: string[];
  views: ExtendedView[];
  loadedHeight: number;
  loadedWidth: number;
};

type ExtendedView = {
  view?: BrowserView;
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  insertedCSS?: any;
  leftOffset?: number;
};

const groups: { [key: string]: Group } = {
  google: {
    id: 'google',
    short: 'g',
    extensions: ['google'],
    loadedHeight: 0,
    loadedWidth: 0,
    views: [
      {
        id: 'google',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
      },
    ],
  },
  duckduckgo: {
    id: 'duckduckgo',
    short: 'd',
    extensions: ['duckduckgo'],
    loadedHeight: 0,
    loadedWidth: 0,
    views: [
      {
        id: 'duckduckgo',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
      },
    ],
  },
  chatgpt: {
    id: 'chatgpt',
    short: 'c',
    extensions: ['chatgpt'],
    loadedHeight: 0,
    loadedWidth: 0,
    views: [
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
    extensions: ['separator', 'google', 'duckduckgo'],
    loadedHeight: 0,
    loadedWidth: 0,
    views: [
      {
        id: 'separator',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        leftOffset: 0.5,
      },
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
        width: 0.5,
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
    extensions: ['separator', 'google', 'chatgpt'],
    loadedHeight: 0,
    loadedWidth: 0,
    views: [
      {
        id: 'separator',
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        leftOffset: 0.6,
      },
      {
        id: 'google',
        width: 0.6,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
      },
      {
        id: 'chatgpt',
        width: 0.39,
        height: 1,
        x: 0.61,
        y: 0,
        loadedInitialURL: false,
      },
    ],
  },
};

const idToUrl: { [keheight: string]: string } = {
  // google: 'https://google.com',
  google: 'https://brave.com',
  duckduckgo: 'https://duckduckgo.com',
  wolframalpha: 'https://wolframalpha.com',
  // chatgpt: 'https://chat.openai.com',
  chatgpt: 'https://microsoft.com',
  bing: 'https://bing.com',
  separator: 'https://google.com',
};

export { extensions, groups, idToUrl, Group, ExtendedView };
