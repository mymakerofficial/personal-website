<template>
  <div ref="el" :style="{position: 'relative', left: `${this.left}px`, top: `${this.top}px`}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MouseDistanceAnimationElement",

  props: ['amount','distance'],

  data() {
    return {
      left: 0,
      top: 0,
    }
  },

  methods: {
    update(){
      this.$nextTick(() => {
        this.left = Math.sin(Math.max(this.distance - Math.abs(this.$store.state.mouse.position.y + window.pageYOffset - this.$refs.el.offsetTop - (this.$refs.el.offsetHeight  / 2)), 0) / this.distance) * this.amount
        window.requestAnimationFrame(this.update);
      })
    },
  },

  created() {
    this.update();
  }
}
</script>

<style scoped>

</style>