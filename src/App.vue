<template>
  <div id="app" left-fixed-sidebar>
    <app-navigation-drawer></app-navigation-drawer>    
  </div>
</template>

<script>
import '../node_modules/leaflet/dist/leaflet.css'
import NavigationDrawer from './components/NavigationDrawer'

export default {
  name: 'app',
  components: {
    'app-navigation-drawer': NavigationDrawer
  }
}
</script>

<style>
/*@import "https://unpkg.com/vuetify/dist/vuetify.min.css";*/

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
