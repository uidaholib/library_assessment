<template>
  <div id="app">
    <app-navbar></app-navbar>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import '../node_modules/leaflet/dist/leaflet.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'

export default {
  name: 'app',
  components: {
    'app-navbar': Navbar,
    'app-footer': Footer
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
