import { BrowserView } from 'electron';
const extensions = ['google', 'duckduckgo', 'wolframalpha', 'chatgpt', 'bing'];

type Group = {
  id: string;
  short: string;
  extensions: string[];
  dimensions: number[];
  xOffsets: number[];
  loadedInitialURLs: boolean[];
  views: BrowserView[];
};

const groups: { [key: string]: Group } = {
  google: {
    id: 'google',
    short: 'g',
    extensions: ['google'],
    dimensions: [1],
    xOffsets: [0],
    loadedInitialURLs: [false],
    views: [],
  },
  duckduckgo: {
    id: 'duckduckgo',
    short: 'd',
    extensions: ['duckduckgo'],
    dimensions: [1],
    xOffsets: [0],
    loadedInitialURLs: [false],
    views: [],
  },
  chatgpt: {
    id: 'chatgpt',
    short: 'c',
    extensions: ['chatgpt'],
    dimensions: [1],
    xOffsets: [0],
    loadedInitialURLs: [false],
    views: [],
  },
  'google-duckduckgo': {
    id: 'google-duckduckgo',
    short: 'gd',
    extensions: ['google', 'duckduckgo'],
    dimensions: [0.5, 0.5],
    xOffsets: [0, 0.5],
    loadedInitialURLs: [false, false],
    views: [],
  },
};

const idToUrl: { [key: string]: string } = {
  google: 'https://google.com',
  duckduckgo: 'https://duckduckgo.com',
  wolframalpha: 'https://wolframalpha.com',
  chatgpt: 'https://chat.openai.com',
  bing: 'https://bing.com',
};

export { extensions, groups, idToUrl, Group };
