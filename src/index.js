import {IndexController} from './IndexController.js';

const indexController = new IndexController(document.querySelector('#maincontent'));
window.initMap = indexController.initMap;
