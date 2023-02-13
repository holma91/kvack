const { contextBridge, webFrame } = require('electron');
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames = [
  'changeSearchInput',
  'onPreviousTab',
  'onShowSidebar',
  'onHideSidebar',
  'setGroup',
  'onNextTab',
  'onSelectedGroupChange',
];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);
