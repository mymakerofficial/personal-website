<template>
  <div v-if="loaded">
    <CookieMessage></CookieMessage>
    <router-view></router-view>
  </div>
</template>

<script>
import CookieMessage from "@/components/CookieMessage";
export default {
  name: "App",
  components: {CookieMessage},
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

    document.body.addEventListener('wheel', () => {
      this.$store.dispatch('mouse/updateScroll')
    })
  }
}
</script>

<style lang="scss">
@import "sass/app";
</style>