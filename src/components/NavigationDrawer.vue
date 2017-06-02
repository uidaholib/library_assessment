<template>
  <v-app id="navigation-drawer">
    <v-navigation-drawer class="grey lighten-4" persistent light :mini-variant.sync="mini" v-model="drawer">
      <v-list class="pa-0">
        <v-list-item v-if="user">
          <v-list-tile avatar tag="div" ripple>
            <v-list-tile-avatar>
              <img v-if="(user && user.thumbnail)" :src="user.thumbnail" />
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
        </v-list-item>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-item v-for="item in navItems" :key="item" @click="navigateTo(item.to)">
          <v-list-tile ripple v-if="item.display">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="indigo darken-4">
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <h5 class="text-xs-left white--text pt-3">{{title}}</h5>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-toolbar-item ripple v-if="user">
          <v-btn icon light>
            <v-icon>account_circle</v-icon>
          </v-btn>
          <span class="white--text">{{user.fullName.split()[0]}}</span>
        </v-toolbar-item>
        <v-toolbar-item ripple @click.native.stop="signOut" v-if="false">
          <v-btn icon light>
            <v-icon>power_settings_new</v-icon>
          </v-btn>
          LOGOUT
        </v-toolbar-item>
        <v-toolbar-item ripple @click.native.stop="signIn" v-if="!isAuthenticated">
          <v-btn icon light>
            <v-icon>person</v-icon>
          </v-btn>
          <span class="white--text">LOGIN</span>
        </v-toolbar-item>
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
      title: 'LIBRARY ASSESSMENT',
      navItems: [
        // { title: 'Map', to: '/', icon: 'map', isActive: true },
        { title: 'Map', to: '/home', icon: 'map', isActive: true, display: true },
        { title: 'Charts', to: '/charts', icon: 'show_chart', isActive: false, display: this.user },
        { title: 'Tables', to: '/tables', icon: 'grid_on', isActive: false, display: this.user }
      ],
      drawer: true,
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
      if (!value) {
        router.push('/')
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
      router.push(to)
    },
    signIn() {
      oauth2.oauth()
    },
    signOut() {
    }
  }
}
</script>

<style>

</style>
