<template>
  <div id='auth' class="container">
    <h1 class="text-primary">Login to Arcgis Online</h1>
    <form>
      <div class="form-group">
        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email" v-model="username">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password">
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="login">Login</button>
    </form>
  </div>
</template>

<script>
import L from 'leaflet'
import esri from 'esri-leaflet'
import router from '../router'
import auth0 from '../services/auth'

export default {
  name: 'auth',
  data() {
    let username = ''
    let password = ''
    return {
      username,
      password
    }
  },
  computed: {
    user() {
      return { username: this.userame, password: this.password };
    }
  },
  methods: {
    login() {
      const credentials = {
        username: this.username,
        password: this.password,
        f: 'json',
        expiration: 20160,
        client: 'referer',
        referer: window.location.origin
      }
      auth0.login(credentials).then(data => {
        const token = auth0.getAccessToken()
        console.log('auth user data: ', data)
        console.log('auth access token: ', token)
        router.push({ name: 'home', params: { userdata: data, token } })
      })
    }
  }
}
</script>

<style scoped>
#auth {}
</style>
