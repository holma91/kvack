const { contextBridge, webFrame } = require('electron');
import api from '../api';
import { getRelevantApi } from '../utils/helper';

const functionNames = [
  'changeSearchInput',
  'onNextTab',
  'onPreviousTab',
  'onShowSidebar',
  'onHideSidebar',
  'setGroup',
];
const relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);
