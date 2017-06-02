<template>
  <v-container id='login' class="px-4">
      <v-card class="grey lighten-4 elevation-2">
        <v-card-row>
          <v-card-title>Login to Arcgis Online</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <v-text-field label="Username" v-model="username" required />
              <v-text-field label="Password" v-model="password" type="password" required />
              <small>*indicates required field</small>
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="white--text blue darken-3" raised @click.native="login">Login</v-btn>
        </v-card-row>
      </v-card>
  </v-container>
</template>

<script>
import auth from '../services/auth'

export default {
  name: 'login',
  data() {
    let username
    let password
    return {
      username,
      password
    }
  },
  computed: {
  },
  methods: {
    login() {
      const expiration = 20160
      const credentials = {
        username: this.username,
        password: this.password,
        f: 'json',
        expiration: expiration,
        client: 'referer',
        referer: window.location.origin
      }
      this.$store.dispatch('login', credentials)
    }
  },
  beforeCreate() {
    auth.clearAccessToken()
    auth.clearUserDataToken()
    this.$store.commit('setUser', null)
    this.$store.commit('setToken', null)
  }
}
</script>

<style scoped>
#login {
}
</style>
