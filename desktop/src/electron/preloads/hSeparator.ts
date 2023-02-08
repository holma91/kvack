const { contextBridge, webFrame } = require('electron');
import api from '../api';
import { getRelevantApi } from '../utils/helper';

let functionNames = ['resizeBar', 'onWindowResize'];
let relevantApi = getRelevantApi(api, functionNames);

contextBridge.exposeInMainWorld('api', relevantApi);
