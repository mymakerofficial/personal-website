<template>
  <div v-if="!this.$store.state.cookieDialogue.messageDismissed">
    <div class="cookieMessage" ref="el">
      <h6><i class="mdi mdi-cookie"></i> {{this.$store.getters["cookieDialogue/getCurrentMessage"].header}}</h6>
      <div>
        <p>{{this.$store.getters["cookieDialogue/getCurrentMessage"].text}}</p>
        <button class="solid" @click="dismiss(button.target)" v-for="button in this.$store.getters['cookieDialogue/getCurrentMessage'].buttons" :key="button.target">{{ button.text }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import anime from "animejs";
import eventBus from "@/eventBus";

export default {
  name: "CookieMessage",


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
    dismiss(target) {
      anime({
        targets: this.$refs.el,
        translateX: [0, -10, 600],
        duration: 400,
        easing: 'cubicBezier(0.5, .05, .1, .3)',
        autostart: true,
        complete: () => {
          this.$refs.el.style.transform = ""
          this.$store.dispatch('cookieDialogue/dismissMessage', target)
        }
      })
    }
  },

  created() {
    this.fadein()
    eventBus.$on('cookie-message-dismissed-changed', () => {
      if(!this.$store.state.cookieDialogue.messageDismissed) this.fadein()
    })
  }
}
</script>

<style scoped>

</style>