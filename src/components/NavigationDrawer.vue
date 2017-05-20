<template>
  <v-app id="navigation-drawer" class="elevation-2" sidebar-under-toolbar top-toolbar left-sidebar>
    <v-toolbar class="white--text indigo">
      <v-toolbar-side-icon class="hidden-lg-and-up" @click.native.stop="appSidebar = !appSidebar" />
      <v-toolbar-title class="text-xs-left" v-text="title"></v-toolbar-title>
      <v-toolbar-items>
        <v-toolbar-item ripple v-if="user">
          <v-btn icon dark>
            <v-icon>account_circle</v-icon>
          </v-btn>
          {{user.lastName}}
        </v-toolbar-item>
        <v-toolbar-item ripple @click.native.stop="logout" v-if="isAuthenticated">
          <v-btn icon dark>
            <v-icon>power_settings_new</v-icon>
          </v-btn>
          Logout
        </v-toolbar-item>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-sidebar v-model="appSidebar" height="auto">
        <v-list dense v-for="(item,i) in navItems" :key="i">
          <v-list-item @click="navigateTo(item.to)">
            <v-list-tile ripple>
              <v-list-tile-avatar>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title" />
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-sidebar>
      <v-content>
        <v-container>
          <v-scale-transition mode="out-in" origin="center center">
            <router-view></router-view>
          </v-scale-transition>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '../router'
import auth from '../services/auth'
export default {
  data() {
    return {
      appSidebar: true,
      title: 'LIBRARY ASSESSMENT',
      navItems: [
        { title: 'Map', to: '/home', icon: 'map', isActive: true },
        { title: 'Charts', to: '/charts', icon: 'show_chart', isActive: false },
        { title: 'Tables', to: '/tables', icon: 'grid_on', isActive: false }
      ]
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
    }
  }
}
</script>

<style>

</style>
