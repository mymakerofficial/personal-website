<template>
  <div v-if="loaded">
    <Navbar></Navbar>
    <CookieMessage></CookieMessage>
    <router-view></router-view>
  </div>
</template>

<script>
import CookieMessage from "@/components/CookieMessage";
import Navbar from "@/components/Navbar";
import eventBus from "@/eventBus";
export default {
  name: "App",
  components: {Navbar, CookieMessage},
  data() {
    return {
      loaded: false
    }
  },

  beforeCreate() {
    this.$store.dispatch("projects/load").then(() => {
      this.$store.dispatch("cookieDialogue/load").then(() => {
        this.loaded = true;
      });
    });

    // load data from local storage
    this.$store.dispatch("initialiseStore")

    // update last load time
    this.$store.dispatch("user/load")

    // update git commit sha
    this.$store.dispatch("user/setGitCommitSha", process.env.VUE_APP_VERCEL_GIT_COMMIT_SHA)

    console.log("Time since last page exit: ", (new Date().getTime() / 1000) - this.$store.state.user.lastPageExit)

    eventBus.$on('site-version-changed', () => {
      console.log("Site version changed!")
    })

    // show return message when user last exited website over 6 hours ago
    if(this.$store.state.user.lastPageExit !== 0){
      if((new Date().getTime() / 1000) - this.$store.state.user.lastPageExit > 3600){
        this.$store.dispatch("cookieDialogue/setReturnMessage")
      }
    }

    // reset if something goes wrong
    if(this.$store.state.cookieDialogue.currentKey === '' && this.$store.state.cookieDialogue.nextKey === ''){
      this.$store.dispatch("cookieDialogue/dismissMessage", {target: 'start', delay: 1})
    }

    // save timestamp when user leaves page
    window.onunload = () => {
      this.$store.dispatch("user/exit")
    }

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