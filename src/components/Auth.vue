<template>
  <div id='auth'>
    <div v-if="!isAuthenticated">
      <h1>You are not connected to arcgis</h1>
      <button type="button" @click.prevent="authenticate">Sign in</button>
    </div>
  </div>
</template>

<script>
import esri from 'esri-leaflet'

export default {
  name: 'auth',
  data() {
    let isAuthenticated = false;
    let accessToken;
    let callbacks = [];
    const clientID = 'TKLwzwlNqJgTIYnf';
    const protocol = window.location.protocol;
    const callbackPage = protocol + '//webpages.uidaho.edu/~bgodfrey/library-space-assessment/oauth/callback.html';
    return {
      isAuthenticated,
      callbacks,
      clientID,
      callbackPage
    }
  },
  computed: {
  },
  methods: {
    authenticate() {
      this.oauth(this.oauthCallback);
    },
    oauth(callback) {
      if (this.accessToken) {
        callback(this.accessToken);
      } else {
        this.callbacks.push(callback);
        window.open('https://www.arcgis.com/sharing/oauth2/authorize?client_id=' + this.clientID + '&response_type=token&expiration=20160&redirect_uri=' + window.encodeURIComponent(this.callbackPage), 'oauth', 'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes');
      }
    },
    oauthCallback (token) {
      esri.get('https://www.arcgis.com/sharing/rest/portals/self', {
        token: token
      }, function (error, response) {
        console.error(response)
      });
    }
  },
  mounted() {
    
  }
}
</script>

<style scoped>
#auth {
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
