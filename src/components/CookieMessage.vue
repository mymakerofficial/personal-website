<template>
  <div v-if="this.$route.name === 'home' && ['onzjd5','SrQdQu','CHPLbl'].includes(this.$store.state.cookieDialogue.currentKey)">
    <div class="cookieNotification" ref="notification" v-if="!this.$store.state.cookieDialogue.messageDismissed && this.$store.state.cookieDialogue.messageMinimised" @click="unhide">
      <h6><i v-if="['onzjd5','SrQdQu','CHPLbl'].includes(this.$store.state.cookieDialogue.currentKey)" class="mdi mdi-hand-wave"></i><i v-else class="mdi mdi-cookie-alert"></i></h6>
    </div>
    <div class="cookieMessage" ref="message" v-if="!this.$store.state.cookieDialogue.messageDismissed && !this.$store.state.cookieDialogue.messageMinimised">
      <button class="flat" @click="hide()" v-if="this.$store.state.cookieDialogue.messageCount !== 0" style="position: absolute; top: 0; right: 0; margin: 0; background-color: transparent; border: transparent"><i class="mdi mdi-window-close"></i></button>
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
    unhide() {
      anime({
        targets: this.$refs.notification,
        translateX: [0, -100],
        translateY: [0, -100],
        scale: [1, 2],
        opacity: [1, 0],
        duration: 60,
        easing: 'cubicBezier(0.5, .05, .1, .3)',
        autostart: true,
        complete: () => {
          this.$store.dispatch('cookieDialogue/unhideMessage')
          anime.set(this.$refs.notification,{
            scale: 1,
            translateX: 0,
            translateY: 0,
            opacity: 1
          })
        }
      })
    },
    hide() {
      this.$store.dispatch('cookieDialogue/hideMessage')
    },
    fadein() {
      this.$nextTick(() => {
        anime.set(this.$refs.message,{
          translateX: 600
        })

        anime({
          targets: this.$refs.message,
          translateX: [600, -30, 0],
          duration: 700,
          easing: 'cubicBezier(0.5, .05, .1, .3)',
          autostart: true
        })

        anime.set(this.$refs.notification,{
          translateX: 600
        })

        anime({
          targets: this.$refs.notification,
          translateX: [600, -30, 0],
          duration: 700,
          easing: 'cubicBezier(0.5, .05, .1, .3)',
          autostart: true
        })
      })
    },
    shake() {
      anime({
        targets: this.$refs.message,
        translateX: [0, -32, 32, -32, 32, -32, 0],
        duration: 400,
        easing: 'linear',
        autostart: true,
      })
    },
    dismiss(button) {
      if(!button.target){
        this.shake()
        return;
      }

      anime({
        targets: this.$refs.message,
        translateX: [0, -10, 600],
        duration: 400,
        easing: 'cubicBezier(0.5, .05, .1, .3)',
        autostart: true,
        complete: () => {
          this.$refs.message.style.transform = ""
          this.$store.dispatch('cookieDialogue/dismissMessage', {target: button.target, delay: button.delay})

          if(button.delay > 8){
            this.hide()
          }
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