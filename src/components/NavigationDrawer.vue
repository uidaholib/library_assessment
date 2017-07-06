<template>
  <v-app id="navigation-drawer" standalone>
    <v-navigation-drawer class="grey lighten-4" temporary light :mini-variant.sync="mini" v-model="drawer" overflow>
      <v-list class="pa-0">
        <v-list-tile v-if="user" avatar tag="div" ripple>
          <v-list-tile-avatar>
            <img v-if="(user && user.thumbnail)" :src="user.thumbnail" 0></img>
            <v-icon v-else>account_circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="user.fullName"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in navItems" :key="item" @click="navigateTo(item.to)" ripple v-if="item.display">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="indigo darken-4" fixed dark>
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><small>{{title | uppercase}}</small>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-if="user" flat light ripple class="hidden-xs-only">
          <v-icon dark>account_circle</v-icon>{{user.fullName.split()[0]}}
        </v-btn>
        <v-btn flat light ripple @click.native.stop="signIn" v-if="!isAuthenticated">
          <v-icon dark>person</v-icon>SIGN IN
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-scale-transition mode="out-in" origin="center center">
          <router-view></router-view>
        </v-scale-transition>
        <!--v-router-->
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '../router'
import oauth2 from '../services/oauth2.js'

export default {
  data() {
    return {
      appSidebar: true,
      title: 'Space Assessment Dashboard',
      navItems: [
        // { title: 'Map', to: '/', icon: 'map', isActive: true },
        { title: 'Map', to: 'app-map', icon: 'map', isActive: true, display: true },
        { title: 'Tables', to: 'building-table', icon: 'grid_on', isActive: false, display: this.user },
        { title: 'Charts', to: 'building-chart', icon: 'show_chart', isActive: false, display: this.user }
      ],
      drawer: null,
      mini: false,
      right: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      isAuthenticated: 'getAuthentication'
    })
  },
  watch: {
    isAuthenticated(value) {
      // if (!value) {
      //   router.push('/')
      // }
      if (value) {
        this.drawer = false
      }
    },
    user(value) {
      if (value) {
        this.navItems.forEach((item, i) => {
          if (i >= 1) {
            item.display = true
          }
        })
      }
      else {
        this.navItems.forEach((item, i) => {
          if (i >= 1) {
            item.display = false
          }
        })
      }
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout')
    },
    navigateTo(to) {
      router.push('#' + to)
    },
    signIn() {
      this.drawer = false
      oauth2.oauth()
    },
    signOut() {
    }
  },
  filters: {
    uppercase(value) {
      return value.toUpperCase()
    }
  }
}
</script>

<style>

</style>
