<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",

  beforeCreate() {
    this.$store.dispatch("initialiseStore")
  }
}
</script>

<style scoped>

</style>