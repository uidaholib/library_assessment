<template>
  <div class="home container row">
    <div class="container">
      <h2 v-if="!isAuthenticated">You are not logged in</h2>
      <!--<h2 v-if="isAuthenticated">Welcome {{user.fullName}}</h2>-->
      <button class="btn btn-danger" @click.prevent="logout">Logout</button>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import esri from 'esri-leaflet';
import mapLayers from '../services/map-layers.js'
import { mapGetters } from 'vuex'
import router from '../router'
import auth from '../services/auth'

export default {
  name: 'home',
  data() {
    let user
    let token
    let floorLvl
    return {
      user,
      token,
      floorLvl,
      map: null
    }
  },
  computed: {
    ...mapGetters({
      getToken: 'getToken',
      getUser: 'getUser',
      isAuthenticated: 'getAuthentication'
    })
  },
  watch: {
    token(value) {
      mapLayers.spaceAssessmentFeatureLayer(value, this.map)
      mapLayers.floorPlansBasemap(value, this.floorLvl, this.map)
    },
    isAuthenticated(value) {
      if (!value) {
        router.push('/')
      }
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout')
    }
  },
  mounted() {
    this.map = L.map('map').setView([46.7274, -117.0144], 19);
    esri.basemapLayer('Topographic').addTo(this.map);
    // if (this.isAuthenticated) {
    // console.log('user authenticated!')
    this.token = this.getToken
    this.user = this.getUser
    console.log('authenticated!', this.isAuthenticated)
    console.log('user token: ', this.token)
    console.log('user: ', this.user)
    this.floorLvl = '1st'
    mapLayers.spaceAssessmentFeatureLayer(this.token, this.map)
    mapLayers.floorPlansBasemap(this.token, this.floorLvl, this.map)
    // }
  },
  beforeCreate() {
    // this.$store.dispatch('login')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  height: 100vh;
  width: 100vw;
  position: relative;
}
</style>
