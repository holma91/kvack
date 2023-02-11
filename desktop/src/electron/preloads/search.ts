const { contextBridge, webFrame } = require('electron');
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames = [
  'changeSearchInput',
  'onNextGroup',
  'onPreviousGroup',
  'onPreviousTab',
  'onShowSidebar',
  'onHideSidebar',
  'setGroup',
  'onNextTab',
];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);
