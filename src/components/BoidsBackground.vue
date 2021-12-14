<template>
  <div>
    <div class="backgroundBackground"></div>
    <div v-show="!benchmarking" ref="backgroundCanvas" class="backgroundCanvas"></div>
    <span v-if="showStats" v-show="!benchmarking" class="backgroundStats" :class="{hide: !this.statsVisible}">
      <Tooltip :tooltip="calculationTooltip" :arrow="false">
        <span class="listItem">{{amount}} <i class="mdi mdi-circle-multiple-outline"></i></span>
        <span class="listItem">{{time.toFixed(1)}}ms <i class="mdi mdi-clock-outline"></i></span>
      </Tooltip>
      <Tooltip :tooltip="renderTooltip" :arrow="false">
        <span class="listItem">{{triangles}} <i class="mdi mdi-triangle-outline"></i></span>
        <span class="listItem">{{fps}}fps <i class="mdi mdi-eye-outline"></i></span>
      </Tooltip>
    </span>
  </div>
</template>

<script>
import background from "@/js/background";
import Tooltip from "@/components/Tooltip";

export default {
  name: "BoidsBackground",
  components: {Tooltip},

  props: ["showStats"],

  data() {
    return {
      background: null,
      amount: 0,
      time: 0,
      fps: 0,
      triangles: 0,
      benchmarking: false,
      statsVisible: true
    }
  },

  computed: {
    calculationTooltip: function () {
      return `${this.amount} boids are being simulated in ${this.time.toFixed(1)}ms per frame`
    },
    renderTooltip: function () {
      return `${this.triangles} polygons are being rendered with ${this.fps}fps`
    }
  },

  methods: {
    start(){
      this.$nextTick(() => {
        background.setup(this.$refs.backgroundCanvas)
        background.render()

        this.benchmarking = true;
        background.benchmark(100, 1000, 16, 10, 100).then(() => {
          this.benchmarking = false;
        });

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