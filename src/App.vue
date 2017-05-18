<template>
  <div id="app">
    <app-navbar></app-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import '../node_modules/leaflet/dist/leaflet.css';
import NavBar from './components/NavBar';

export default {
  name: 'app',
  components: {
    'app-navbar': NavBar
  }
}
</script>

<style>
/*@import "../node_modules/leaflet/dist/leaflet.css";*/
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
