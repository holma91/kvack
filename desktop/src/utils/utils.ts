import { BrowserView } from 'electron';
const extensions = ['google', 'duckduckgo', 'wolframalpha', 'chatgpt', 'bing'];

type Group = {
  id: string;
  short: string;
  extensions: string[];
  views: ExtendedView[];
};

type ExtendedView = {
  view?: BrowserView;
  id: string;
  dimension: number;
  width: number;
  height: number;
  x: number;
  y: number;
  loadedInitialURL: boolean;
  loadedHeight: number;
  loadedWidth: number;
  insertedCSS?: any;
  leftOffset?: number;
};

const groups: { [keheight: string]: Group } = {
  google: {
    id: 'google',
    short: 'g',
    extensions: ['google'],
    views: [
      {
        id: 'google',
        dimension: 1,
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        loadedHeight: 0,
        loadedWidth: 0,
      },
    ],
  },
  duckduckgo: {
    id: 'duckduckgo',
    short: 'd',
    extensions: ['duckduckgo'],
    views: [
      {
        id: 'duckduckgo',
        dimension: 1,
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        loadedHeight: 0,
        loadedWidth: 0,
      },
    ],
  },
  chatgpt: {
    id: 'chatgpt',
    short: 'c',
    extensions: ['chatgpt'],
    views: [
      {
        id: 'chatgpt',
        dimension: 1,
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        loadedHeight: 0,
        loadedWidth: 0,
      },
    ],
  },
  'google-duckduckgo': {
    id: 'google-duckduckgo',
    short: 'gd',
    extensions: ['separator', 'google', 'duckduckgo'],
    views: [
      {
        id: 'separator',
        dimension: 1,
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        leftOffset: 0.5,
        loadedHeight: 0,
        loadedWidth: 0,
      },
      {
        id: 'google',
        dimension: 0.5,
        width: 0.5,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        loadedHeight: 0,
        loadedWidth: 0,
      },
      {
        id: 'duckduckgo',
        dimension: 0.49,
        width: 0.5,
        height: 1,
        x: 0.51,
        y: 0,
        loadedInitialURL: false,
        loadedHeight: 0,
        loadedWidth: 0,
      },
    ],
  },
  'google-chatgpt': {
    id: 'google-chatgpt',
    short: 'gc',
    extensions: ['separator', 'google', 'chatgpt'],
    views: [
      {
        id: 'separator',
        dimension: 1,
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        leftOffset: 0.6,
        loadedHeight: 0,
        loadedWidth: 0,
      },
      {
        id: 'google',
        dimension: 0.5,
        width: 0.6,
        height: 1,
        x: 0,
        y: 0,
        loadedInitialURL: false,
        loadedHeight: 0,
        loadedWidth: 0,
      },
      {
        id: 'chatgpt',
        dimension: 0.49,
        width: 0.39,
        height: 1,
        x: 0.61,
        y: 0,
        loadedInitialURL: false,
        loadedHeight: 0,
        loadedWidth: 0,
      },
    ],
  },
};

const idToUrl: { [keheight: string]: string } = {
  google: 'https://google.com',
  duckduckgo: 'https://duckduckgo.com',
  wolframalpha: 'https://wolframalpha.com',
  chatgpt: 'https://chat.openai.com',
  bing: 'https://bing.com',
  separator: 'https://google.com',
};

export { extensions, groups, idToUrl, Group, ExtendedView };
