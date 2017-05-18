<template>
  <div id='main-content'>
    <div class='map-options'></div>
    <div id='map-container'>
      <esri-map></esri-map>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '../router'
import auth from '../services/auth'
import map from './Map'

export default {
  name: 'home',
  data() {
    let user
    return {
      user
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'getUser',
      isAuthenticated: 'getAuthentication'
    })
  },
  watch: {
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
  },
  created() {
    this.user = this.getUser
    console.log('authenticated!', this.isAuthenticated)
    console.log('user: ', this.user)
  },
  components: {
    'esri-map': map
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map-container {
}
</style>
