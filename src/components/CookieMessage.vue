<template>
  <div v-if="!this.$store.state.cookieDialogue.messageDismissed">
    <div class="cookieMessage" ref="el">
      <h6 v-html="header" v-if="header"></h6>
      <span v-html="text" v-if="text"></span>
      <button @click="dismiss(button)" v-for="button in this.$store.getters['cookieDialogue/getCurrentMessage'].buttons" :key="button.target" v-html="applyMarkdown(button.text)" :class="button.class"></button>
    </div>
  </div>
</template>

<script>
import anime from "animejs";
import eventBus from "@/eventBus";
import {markdown} from "@/js/markdown";

export default {
  name: "CookieMessage",

  computed: {
    header() {
      if(!this.$store) return ""
      return markdown(this.$store.getters["cookieDialogue/getCurrentMessage"].header)
    },
    text() {
      if(!this.$store) return ""
      return markdown(this.$store.getters["cookieDialogue/getCurrentMessage"].text)
    }
  },

  methods: {
    applyMarkdown: (value) => markdown(value),
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
    dismiss(button) {
      anime({
        targets: this.$refs.el,
        translateX: [0, -10, 600],
        duration: 400,
        easing: 'cubicBezier(0.5, .05, .1, .3)',
        autostart: true,
        complete: () => {
          this.$refs.el.style.transform = ""
          this.$store.dispatch('cookieDialogue/dismissMessage', {target: button.target, delay: button.delay})
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