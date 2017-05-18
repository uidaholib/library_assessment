<template>
  <div id="map">
  </div>
</template>

<script>
import L from 'leaflet';
import esri from 'esri-leaflet';
import mapLayers from '../services/map-layers.js'
import { mapGetters } from 'vuex'

export default {
  name: 'map',
  data() {
    let map
    let token
    let floorLvl
    return {
      map,
      token,
      floorLvl
    }
  },
  watch: {
    token(value) {
      mapLayers.spaceAssessmentFeatureLayer(value, this.map)
      mapLayers.floorPlansBasemap(value, this.floorLvl, this.map)
    }
  },
  computed: {
    ...mapGetters({
      getToken: 'getToken'
    })
  },
  methods: {

  },
  created() {
    this.token = this.getToken
    this.floorLvl = '1st'
  },
  mounted() {
    this.map = L.map('map').setView([46.7274, -117.0144], 19);
    esri.basemapLayer('Topographic').addTo(this.map);
    mapLayers.spaceAssessmentFeatureLayer(this.token, this.map)
    mapLayers.floorPlansBasemap(this.token, this.floorLvl, this.map)
  }
}
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100vw;
}
</style>
