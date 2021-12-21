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

    document.body.addEventListener('mousemove', (e) => {
      this.$store.commit('mouse/updatePosition',
          {
            x: e.clientX,
            y: e.clientY
          }
      )
    });

    document.body.addEventListener('touchstart', (e) => {
      this.$store.commit('mouse/updatePosition',
          {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }
      )
    });

    document.body.addEventListener('touchmove', (e) => {
      this.$store.commit('mouse/updatePosition',
          {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }
      )
    });
  }
}
</script>

<style lang="scss">
@import "sass/app";
</style>