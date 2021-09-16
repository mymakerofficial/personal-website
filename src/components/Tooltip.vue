<template>
  <span @mouseover="startHover" @mouseleave="stopHover" @mousemove="move">
    <span ref="content"><slot></slot></span>
    <span v-if="hover" v-show="show"><span class="tooltip" ref="tooltip" :style="{ top: top, left: left }">{{this.tooltip}}</span><span class="tooltipArrow" ref="tooltipArrow" :style="{ top: arrowTop, left: arrowLeft }"></span></span>
  </span>
</template>

<script>
export default {
  name: "Tooltip",

  props: ["tooltip", "time"],

  data() {
    return {
      hover: false,
      show: false,
      mouseX: 0,
      mouseY: 0,
      left: 0,
      top: 0,
      arrowLeft: 0,
      arrowTop: 0,
      timeout: null,
    }
  },

  methods: {
    startHover() {
      this.hover = true

      this.timeout = setTimeout(() => {
        this.show = this.hover;
        this.$nextTick(() => this.update());
      }, this.time ? this.time : 500);
    },
    stopHover() {
      this.hover = this.show = false

      clearTimeout(this.timeout);
    },
    move(event) {
      this.mouseX = event.clientX
      this.mouseY = event.clientY

      this.update()
    },
    update() {
      let xCenter = this.$refs.content.offsetLeft + this.$refs.content.offsetWidth / 2
      let xDiff = xCenter - this.mouseX

      let x = Math.max(xCenter - xDiff / 4 - this.$refs.tooltip.offsetWidth / 2, 12)

      let y = this.$refs.content.offsetTop -
          this.$refs.tooltip.offsetHeight -
          this.$refs.content.offsetHeight / 2

      let aX = this.mouseX - 2.5;
      let aY = this.$refs.content.offsetTop -
          this.$refs.content.offsetHeight / 2

      this.left = `${x}px`
      this.top = `${y}px`
      this.arrowLeft = `${aX}px`
      this.arrowTop = `${aY}px`
    }
  }
}
</script>

<style scoped>

</style>