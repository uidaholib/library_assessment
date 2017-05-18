<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">LIBRARY ASSESSMENT</a>
      </div>
      <div id="navbar" class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-left"></ul>
        <ul class="nav navbar-nav navbar-right">
          <li v-if="isAuthenticated">
            <router-link :to="auth">Logout</router-link>
          </li>
          <li>
            <a v-if="user">{{user.lastName}}</a>
          </li>
        </ul>
      </div>
      <!--/.nav-collapse -->
    </div>
    <!--/.container-fluid -->
  </nav>
</template>

<script>
import auth from './Auth'
import { mapGetters } from 'vuex'

export default {
  name: 'navBar',
  data() {
    let isAuthenticated
    return {
      auth,
      isAuthenticated
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken',
      user: 'getUser'
    })
  },
  watch: {
    token(value) {
      this.isAuthenticated = (value !== null)
    }
  },
  methods: {
  },
  created() {
    this.isAuthenticated = (this.token !== null)
  }
}
</script>

<style scoped>

</style>
