type Settings = {
  userId: string;
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

const google: Extension = {
  id: 'google',
  entryUrl: 'https://google.com/',
  preloadPath: 'google_window',
};

const duckduckgo: Extension = {
  id: 'duckduckgo',
  entryUrl: 'https://duckduckgo.com/',
  preloadPath: 'duckduckgo_window',
};

const extensionsById = {
  google,
  duckduckgo,
};

const defaultSettings: Settings = {
  userId: 'lapuerta',
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
