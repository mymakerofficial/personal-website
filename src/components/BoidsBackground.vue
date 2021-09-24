<template>
  <div>
    <div ref="backgroundCanvas" class="backgroundCanvas"></div>
    <span class="backgroundStats" :class="{hide: !this.statsVisible}">{{amount}} boid instances | {{time.toFixed(1)}}ms simulation time | {{triangles}} triangles | {{fps}}fps</span>
  </div>
</template>

<script>
import background from "@/js/background";

export default {
  name: "BoidsBackground",

  data() {
    return {
      background: null,
      amount: 0,
      time: 0,
      fps: 0,
      triangles: 0,
      statsVisible: true
    }
  },

  methods: {
    start(){
      this.$nextTick(() => {
        background.setup(this.$refs.backgroundCanvas)
        background.render()
      })

      setInterval(() => {
        this.amount = background.boidsAmount
        this.time = background.lastSimulationTime
        this.fps = background.fps
        this.triangles = background.renderer.info.render.triangles
      },100);
    },
    resize() {
      background.resize()
    },
    scroll() {
      this.statsVisible = window.pageYOffset === 0;
    }
  },

  created() {
    this.start()
    window.addEventListener("resize", this.resize);
    window.addEventListener("scroll", this.scroll);
  },

  destroyed() {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("scroll", this.scroll);
    background.dispose()
  }
}
</script>

<style scoped>

</style>