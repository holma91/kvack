export const getRelevantApi = (api: any, functionNames: string[]) => {
  let relevantApi = Object.keys(api)
    .filter((key) => functionNames.includes(key))
    .reduce((obj: any, key: string) => {
      obj[key] = api[key];
      return obj;
    }, {});
  return relevantApi;
};
