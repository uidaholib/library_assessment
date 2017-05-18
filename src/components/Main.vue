<template>
  <div class="main">
    <app-navbar></app-navbar>
    <slot></slot>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Navbar from './Navbar'
import Footer from './Footer'

export default {
  name: 'main',
  data() {
    return {}
  },
  components: {
    'app-navbar': Navbar,
    'app-footer': Footer
  }
}
</script>

<style scoped>

</style>
