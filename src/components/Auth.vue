<template>
  <div class="container">
    <div id='auth'>
      <div v-if="!isAuthenticated">
        <h1 class="text-primary">Login to arcgis</h1>
        <form>
          <div class="form-group">
            <label for="exampleInputEmail1">Username</label>
            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email" v-model="username">
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password">
          </div>
          <button type="submit" class="btn btn-default" @click.prevent="authenticate">Submit</button>
        </form>
      </div>
      <div id='map' v-show="isAuthenticated"></div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import esri from 'esri-leaflet'
import router from '../router'

export default {
  name: 'auth',
  data() {
    let username = ''
    let password = ''
    let map
    let isAuthenticated = false;
    const clientID = 'TKLwzwlNqJgTIYnf';
    let accessToken = null;
    let callbacks = [];
    const protocol = 'https:';
    let win
    // const callbackPage = protocol + '//webpages.uidaho.edu/~bgodfrey/library-space-assessment/oauth/callback.html';
    const callbackPage = 'https://www.google.com'
    return {
      username,
      password,
      isAuthenticated,
      callbacks,
      clientID,
      callbackPage,
      win,
      map
    }
  },
  computed: {
    user() {
      const user = { username: this.userame, password: this.password }
      return user;
    }
  },
  methods: {
    authenticate() {
      let token
      let data
      let map = this.map
      this.serverAuth((error, token, data) => {
        this.main(token)
      })
      this.isAuthenticated = true
    },
    serverAuth(callback) {
      const url = 'https://www.arcgis.com/sharing/generateToken'
      let token
      let data
      esri.post(url, {
        username: this.username,
        password: this.password,
        f: 'json',
        expiration: 20160,
        client: 'referer',
        referer: window.location.origin
      }, (error, response) => {
        console.log(response)
        this.accessToken = response.token
        token = response.token
        esri.get('https://www.arcgis.com/sharing/rest/portals/self', {
          token: this.accessToken
        }, function (error, response) {
          data = response
          callback(error, token, data)
        })
      });
    },

    main(token) {
      console.log('my token: ', token)
      let tlFloor = '1st'
      // set the inital map extent and basemap
      esri.featureLayer({
        url: '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assessment_areas/FeatureServer/0',
        //where: 'Floor = 1',
        token: token,
        where: 1
      }).addTo(this.map);
      esri.tiledMapLayer({
        url: '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + tlFloor + '_floor_floor_plans_basemap_web_app/MapServer',
        maxZoom: 19,
        minZoom: 16,
        // do this because to address known bug in esri-leaflet.  Can probably remove in future version of API.
        token: token,
      }).addTo(this.map);
    }

  },
  mounted() {
    this.map = L.map('map').setView([46.7274, -117.0144], 19);
    esri.basemapLayer('Topographic').addTo(this.map);
  }
}
</script>

<style scoped>
#auth {}

#map {
  height: 400pt;
  width: 100%;
}
</style>
