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
          <v-list-tile ripple>
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
      <v-toolbar-title v-text="title" class="text-xs-left"></v-toolbar-title>
      <v-toolbar-items>
        <v-toolbar-item ripple v-if="user">
          <v-btn icon light>
            <v-icon>account_circle</v-icon>
          </v-btn>
          {{user.fullName.split()[0]}}
        </v-toolbar-item>
        <v-toolbar-item ripple @click.native.stop="signOut" v-if="false">
          <v-btn icon light>
            <v-icon>power_settings_new</v-icon>
          </v-btn>
          LOGOUT
        </v-toolbar-item>
        <v-toolbar-item ripple @click.native.stop="signIn" v-else>
          <v-btn icon light>
            <v-icon>person</v-icon>
          </v-btn>
          LOGIN
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
        { title: 'Map', to: '/', icon: 'map', isActive: true },
        { title: 'Charts', to: '/charts', icon: 'show_chart', isActive: false },
        { title: 'Tables', to: '/tables', icon: 'grid_on', isActive: false }
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
      // window.esriSiginIn()
      oauth2.oauth()
    },
    signOut() {
      // window.esriSignOut()
    }
  }
}
</script>

<style>

</style>
