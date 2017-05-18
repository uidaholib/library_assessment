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
        <a class="navbar-brand" href="#">Library Assessment</a>
      </div>
      <!--<div id="navbar" class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <router-link :to="auth">{{authentication}}</router-link>
          </li>
        </ul>
      </div>-->
      <!--/.nav-collapse -->
    </div>
    <!--/.container-fluid -->
  </nav>
</template>

<script>
import auth from './Auth';
export default {
  name: 'navBar',
  data() {
    let authentication = 'Login'
    return {
      auth,
      authentication
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style>

</style>
