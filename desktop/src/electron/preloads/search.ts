const { contextBridge, webFrame } = require('electron');
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames = [
  'changeSearchInput',
  'setGroup',
  'onSelectedGroupChange',
  'onSelectedTabChange',
  'onShowSidebarChange',
  'onGroupsChange',
  'onUrlChange',
];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);
