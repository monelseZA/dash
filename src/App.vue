<template>
  <div id="app">
    <b-container class="mt-3">
      <Dashboard />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Dashboard from './components/Dashboard.vue'

@Component({
  components: {
    Dashboard
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container {
  padding: 1em;
}

.logo {
  max-height: 25px;
  margin-left: 1em;
}
</style>
