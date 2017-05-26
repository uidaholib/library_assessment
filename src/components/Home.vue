<template>
  <v-layout row wrap>
    <v-flex xs12>
      <app-map></app-map>
    </v-flex>
    <v-flex xs12>
      <app-table id="building-table"></app-table>
    </v-flex>
    <v-flex xs12>
      <app-chart id="building-chart"></app-chart>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '../router'
import auth from '../services/auth'
import Map from './Map'
import Table from './Tables'
import Chart from './Charts'

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
    'app-map': Map,
    'app-table': Table,
    'app-chart': Chart
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
