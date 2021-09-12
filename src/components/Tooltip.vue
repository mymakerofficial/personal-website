<template>
  <span @mouseover="hover = true" @mouseleave="hover = false">
    <span ref="content" @mousemove="move"><slot></slot></span>
    <span class="tooltip" ref="tooltip" v-if="hover" :style="{ top: posY, left: posX }">{{this.tooltip}}</span>
  </span>
</template>

<script>
export default {
  name: "Tooltip",

  props: ["tooltip"],

  data() {
    return {
      hover: false,
      posX: 0,
      posY: 0,
    }
  },

  methods: {
    move(event) {
      let x = event.clientX +
          (document.documentElement.scrollLeft || document.body.scrollLeft) -
          this.$refs.tooltip.offsetWidth / 2
      let y = this.$refs.content.offsetTop -
          this.$refs.tooltip.offsetHeight -
          this.$refs.content.offsetHeight / 2

      this.posX = `${x}px`
      this.posY = `${y}px`
    }
  }
}
</script>

<style scoped>

</style>