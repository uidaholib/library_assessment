<template>
  <div class="hello">
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import esri from 'esri-leaflet';

export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      map: null
    }
  },
  mounted() {
    this.map = L.map('map').setView([46.7274, -117.0144], 19);
    esri.basemapLayer('Topographic').addTo(this.map);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  height: 100vh;
  position: relative;
}
</style>
