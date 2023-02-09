import { cssInserts } from './inserts';

export const getRelevantApi = (api: any, functionNames: string[]) => {
  let relevantApi = Object.keys(api)
    .filter((key) => functionNames.includes(key))
    .reduce((obj: any, key: string) => {
      obj[key] = api[key];
      return obj;
    }, {});
  return relevantApi;
};

export const getCSSInserts = (extensionId: string, config: any) => {
  let css = '';
  if (config.inserts.recommended) {
    css += cssInserts[extensionId].recommended;
  }
  if (config.inserts.styles) {
    css += cssInserts[extensionId].styles;
  }
  if (config.inserts.ads) {
    css += cssInserts[extensionId].ads;
  }

  return css;
};
