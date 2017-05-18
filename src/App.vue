<template>
  <div id="app">
    <app-sidebar></app-sidebar>
    <app-main>
      <router-view></router-view>
    </app-main>
  </div>
</template>

<script>
import '../node_modules/leaflet/dist/leaflet.css'
import Sidebar from './components/Sidebar'
import Main from './components/Main'

export default {
  name: 'app',
  components: {
    'app-main': Main,
    'app-sidebar': Sidebar,
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
