const { contextBridge, webFrame } = require('electron');
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames = [
  'changeSearchInput',
  'onShowSidebar',
  'onHideSidebar',
  'setGroup',
  'onSelectedGroupChange',
  'onSelectedTabChange',
];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);
