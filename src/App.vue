<template>
  <div v-if="loaded">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      loaded: false
    }
  },

  beforeCreate() {
    this.$store.dispatch("projects/load").then(() => {
      this.loaded = true;
    });
    this.$store.dispatch("initialiseStore")
  }
}
</script>

<style scoped>

</style>