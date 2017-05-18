<template>
  <div id='auth' class="container jumbotron">
    <h1 class="text-primary">Login to Arcgis Online</h1>
    <form>
      <div class="form-group">
        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Username" v-model="username">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password">
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="login">Login</button>
    </form>
  </div>
</template>

<script>
import auth from '../services/auth'

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
  methods: {
    login() {
      console.log('token: ', auth.getAccessToken(), '\nuser: ', auth.getUserDataToken())
      // const expiration = 20160
      const expiration = 500
      const credentials = {
        username: this.username,
        password: this.password,
        f: 'json',
        expiration: 20160,
        client: 'referer',
        referer: window.location.origin
      }
      this.$store.dispatch('login', credentials)
    }
  },
  mounted() {
    auth.clearAccessToken()
    auth.clearUserDataToken()
  }
}
</script>

<style scoped>
#auth {}
</style>
