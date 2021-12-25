<template>
  <div v-if="!this.$store.state.userPreferences.cookiesDismissed">
    <div class="cookieMessage" ref="el">
      <h6><i class="mdi mdi-cookie"></i> No cookies here.</h6>
      <div v-if="!alternateMessage">
        <p><b>This website does not use any cookies</b> and when you press the button nothing will happen. I know, I find it hard to believe myself.</p>
        <button class="solid" @click="dismiss(false)">I accept this atrocity</button> <button class="noBorder" @click="shake">I disagree</button>
      </div>
      <div v-if="alternateMessage">
        <p>Just as a reminder: This website still uses no cookies. Do you want us to keep you in the loop?</p>
        <p class="secondary"><small>Pro Tip: Click "No. Leave me alone." to never see this message again.</small></p>
        <button class="solid" @click="dismiss(true)">No. Leave me alone.</button> <button class="noBorder" @click="dismiss(false)">Keep me in the loop!</button>
      </div>
    </div>
  </div>
</template>

<script>
import anime from "animejs";
import eventBus from "@/eventBus";

export default {
  name: "CookieMessage",

  computed: {
    alternateMessage: function () {
      return this.$store.state.userPreferences.cookiesDismissCounter % 3 === 2
    }
  },

  methods: {
    fadein() {
      this.$nextTick(() => {
        anime.set(this.$refs.el,{
          translateX: 600
        })

        anime({
          targets: this.$refs.el,
          translateX: [600, -30, 0],
          duration: 700,
          delay: 1000,
          easing: 'cubicBezier(0.5, .05, .1, .3)',
          autostart: true
        })
      })


    },
    shake() {
      anime({
        targets: this.$refs.el,
        translateX: [0, -32, 32, -32, 32, -32, 0],
        duration: 400,
        easing: 'linear',
        autostart: true,
      })
    },
    dismiss(forever) {
      anime({
        targets: this.$refs.el,
        translateX: [0, -10, 600],
        duration: 400,
        easing: 'cubicBezier(0.5, .05, .1, .3)',
        autostart: true,
        complete: () => {
          this.$refs.el.style.transform = ""
          if(forever) this.$store.dispatch('userPreferences/dontShowCookiesAgain')
          this.$store.dispatch('userPreferences/dismissCookies')
        }
      })
    }
  },

  created() {
    this.fadein()
    eventBus.$on('cookies-dismissed-changed', () => {
      if(!this.$store.state.userPreferences.cookiesDismissed) this.fadein()
    })
  }
}
</script>

<style scoped>

</style>