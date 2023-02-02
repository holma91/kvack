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
  xOffset: number;
  loadedInitialURL: boolean;
};

const groups: { [key: string]: Group } = {
  google: {
    id: 'google',
    short: 'g',
    extensions: ['google'],
    views: [
      {
        id: 'google',
        dimension: 1,
        xOffset: 0,
        loadedInitialURL: false,
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
        xOffset: 0,
        loadedInitialURL: false,
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
        xOffset: 0,
        loadedInitialURL: false,
      },
    ],
  },
  'google-duckduckgo': {
    id: 'google-duckduckgo',
    short: 'gd',
    extensions: ['google', 'bing', 'duckduckgo'],
    views: [
      {
        id: 'google',
        dimension: 0.5,
        xOffset: 0,
        loadedInitialURL: false,
      },
      {
        id: 'separator',
        dimension: 0.01,
        xOffset: 0.5,
        loadedInitialURL: false,
      },
      {
        id: 'duckduckgo',
        dimension: 0.49,
        xOffset: 0.51,
        loadedInitialURL: false,
      },
    ],
  },
  // 'google-chatgpt': {
  //   id: 'google-chatgpt',
  //   short: 'gc',
  //   extensions: ['google', 'chatgpt'],
  //   dimensions: [0.5, 0.4],
  //   xOffsets: [0, 0.6],
  //   loadedInitialURLs: [false, false],
  //   views: [
  //     {
  //       id: 'google',
  //       dimension: 0.6,
  //       xOffset: 0,
  //       loadedInitialURL: false,
  //     },
  //     {
  //       id: 'chatgpt',
  //       dimension: 0.4,
  //       xOffset: 0.6,
  //       loadedInitialURL: false,
  //     },
  //   ],
  //   separators: [],
  // },
};

const idToUrl: { [key: string]: string } = {
  google: 'https://google.com',
  duckduckgo: 'https://duckduckgo.com',
  wolframalpha: 'https://wolframalpha.com',
  chatgpt: 'https://chat.openai.com',
  bing: 'https://bing.com',
  separator: 'https://google.com',
};

export { extensions, groups, idToUrl, Group, ExtendedView };
