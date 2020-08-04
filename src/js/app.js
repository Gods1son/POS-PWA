import $$ from 'dom7';
import Framework7, { Template7 } from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';
import 'framework7-icons/css/framework7-icons.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import Routes
import routes from './routes.js';

import List from 'list.js';
import PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import pouchFind from 'pouchdb-find';
//import pouchAuth from 'pouchdb-authentication';

PouchDB.plugin(cordovaSqlitePlugin);
PouchDB.plugin(pouchFind);
//PouchDB.plugin(pouchAuth);
window.PouchDB = PouchDB;
window.List = List;
import Dom7 from 'dom7';
window.$$ = Dom7;
//import * as moment from 'moment';
import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = jQuery;

Template7.registerHelper("money", function(val){
  var sym = localStorage.getItem("currency", val);
  sym = sym == undefined ? "" : sym;
  if(val < 0){
    var rev = 0 - val;
    var val2 = val + rev + rev;
    val = val2;
    sym = "-" + sym;
  }
  val = Math.round((val + Number.EPSILON) * 100) / 100;
  var ret = sym + val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  return ret;
})

Template7.registerHelper("convertDate", function(val){
  var myDate = new Date(val);
  return myDate.toLocaleString();
})

// Import main app component
import App from '../app.f7.html';

setTimeout(function(){
var app = new Framework7({
  root: '#app', // App root element
  component: App, // App main component

  name: 'BizTrack', // App name
  theme: 'auto', // Automatic theme detection



  // App routes
  routes: routes,
  // Register service worker
  serviceWorker: {
    path: '/service-worker.js',
  },
});

var opened = 0;
  function exitApp(){
    if (opened > 0) {
      return false;
    } else {
      app.dialog.confirm('Are you sure you want to exit?', 'Exit App', 
        function () {
        navigator.app.exitApp();
        },
        function () {
        opened = 0;  
        return false;
        }
      );
      opened = 1;
    }
  }
  
      
  function onBackKeyDown() {
    // Handle the back button
    if(app.views.main.history.length == 1){
      exitApp();
      e.preventDefault();
    } else if($(".modal-in").length > 0){
      app.dialog.close(true);
    }
    else {
      
      app.views.main.router.back();
      return false;
    }
  }

  document.addEventListener("backbutton", onBackKeyDown, false);

},3000)
