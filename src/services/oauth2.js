import Router from 'vue-router'
import esri from 'esri-leaflet'
import store from '../vuex/store'

//--------Handle signing into ArcGIS Online to get a token--------
var clientID = 'TKLwzwlNqJgTIYnf';
var accessToken;
var callbacks = [];
var protocol = window.location.protocol;
var callbackPage = protocol + '//gis-dev.northwestknowledge.net/koffi/oauth/callback.html';
console.log('callbackPage: ', callbackPage);

// this function will open a window and start the oauth process
function oauth(callback) {
  if (accessToken) {
    callback(accessToken);
  } else {
    callbacks.push(callback);
    window.open('https://www.arcgis.com/sharing/oauth2/authorize?client_id=' + clientID + '&response_type=token&expiration=20160&redirect_uri=' + window.encodeURIComponent(callbackPage), 'oauth', 'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status' +
        '=yes');
  }
}

// this function will be called when the oauth process is complete
window.oauthCallback = function (token) {
  esri.get('https://www.arcgis.com/sharing/rest/portals/self', {
      token: token
    }, function (error, response) {
      console.log('response: ', response)
      store.commit('setToken', token)
      store.commit('setAuthentication', true)
    });
}

export default {
  oauth
}