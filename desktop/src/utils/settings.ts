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
  extensionSettings: {
    [key: string]: {
      inserts: { styles: boolean; ads: boolean; recommended: boolean };
    };
  };
  layout: string[][];
  positioning: number[][];
};

type LiveGroup = {
  group: Group;
  loadedWidth: number;
  loadedHeight: number;
  loadedSidebarToggleCount: number;
  vSeparators: VSeparatorView[];
  hSeparators: HSeparatorView[];
  pages: PageView[];
  tabs: SomeView[][];
  selectedTab: number;
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
  preloadPath: 'google_window',
};

const duckduckgo: Extension = {
  id: 'duckduckgo',
  // entryUrl: 'https://duckduckgo.com/',
  entryUrl: 'https://duckduckgo.com/?q=something',
  preloadPath: 'duckduckgo_window',
};

const wolframalpha: Extension = {
  id: 'wolframalpha',
  entryUrl: 'https://wolframalpha.com/',
  preloadPath: 'wolframalpha_window',
};

const chatgpt: Extension = {
  id: 'chatgpt',
  entryUrl: 'https://chat.openai.com/',
  preloadPath: 'chatgpt_window',
};

const extensionsById: { [key: string]: Extension } = {
  google,
  duckduckgo,
  wolframalpha,
  chatgpt,
};

const groups: { [key: string]: Group }[] = [
  {
    google: {
      id: 'google',
      shortId: 'g',
      extensionSettings: {
        google: {
          inserts: { styles: false, ads: true, recommended: true },
        },
      },
      layout: [['google']],
      positioning: [[1]],
    },
    'google-chatgpt': {
      id: 'google-chatgpt',
      shortId: 'gc',
      extensionSettings: {
        google: {
          inserts: { styles: false, ads: true, recommended: true },
        },
        chatgpt: {
          inserts: { styles: false, ads: true, recommended: true },
        },
      },
      layout: [['google', 'vSeparator', 'chatgpt']],
      positioning: [[0.5, 0.5]],
    },
    'google-duckduckgo': {
      id: 'google-duckduckgo',
      shortId: 'gd',
      extensionSettings: {
        google: {
          inserts: { styles: false, ads: true, recommended: true },
        },
        duckduckgo: {
          inserts: { styles: false, ads: true, recommended: true },
        },
      },
      // layout: [['google', 'vSeparator', 'duckduckgo']],
      // positioning: [[0.5, 0.5]],
      layout: [['google'], ['duckduckgo']],
      positioning: [[1], [1]],
    },
  },
  /*
  {
    google: {
      id: 'google',
      shortId: 'g',
      extensionSettings: {
        google: {
          inserts: { styles: true, ads: true, recommended: true },
        },
      },
      layout: ['google'],
      positioning: [1],
    },
    chatgpt: {
      id: 'chatgpt',
      shortId: 'c',
      extensionSettings: {
        chatgpt: {
          inserts: { styles: true, ads: true, recommended: true },
        },
      },
      layout: ['chatgpt'],
      positioning: [1],
    },
    'google-chatgpt': {
      id: 'google-chatgpt',
      shortId: 'gc',
      extensionSettings: {
        google: {
          inserts: { styles: true, ads: true, recommended: true },
        },
        chatgpt: {
          inserts: { styles: true, ads: true, recommended: true },
        },
      },
      layout: ['google', 'vSeparator', 'chatgpt'],
      positioning: [0.5, 0.5],
    },
  },
  */
];

const settings: Settings = {
  userId: 'lapuerta',
  windowWidth: 1450,
  windowHeight: 800,
  downloadedExtensions: ['google', 'duckduckgo', 'chatgpt'],
  groups: groups[0],
};

export {
  settings,
  Settings,
  Group,
  LiveGroup,
  extensionsById,
  PageView,
  VSeparatorView,
  HSeparatorView,
  SomeView,
};
