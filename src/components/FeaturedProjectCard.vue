<template>
  <span style="display: inline-block" ref="el">
    <router-link :to="{ name: 'project', params: { name: this.project.name } }" style="text-decoration: none !important;">
      <div class="card" :style="{transform: `translate(${this.translate.x}px,${this.translate.y}px)`}">
        <div class="cardThumbnail" :style="{backgroundImage: `url(${this.project.thumbnail})`}"></div>
        <div class="cardBody">
          <h6>{{this.project.displayName}} <!--<span class="badge"><i class="mdi mdi-tag"></i> {{project.tags[0]}}</span> <span class="badge" v-if="!(new Date() < new Date(project.timespan.release * 1000))"><i class="mdi mdi-calendar"></i> {{project.timespan.year}}</span> <span class="badge" v-if="new Date() < new Date(project.timespan.release * 1000)"><i class="mdi mdi-calendar"></i> coming {{ new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(project.timespan.release * 1000))}} {{new Date(project.timespan.release * 1000).getFullYear()}}</span>--></h6>
          <p class="primary">{{this.project.summary}}</p>
        </div>
      </div>
    </router-link>
  </span>
</template>

<script>
export default {
  name: "FeaturedProjectCard",

  props: ['project'],

  data() {
    return {
      randomOffsetTop: {x: Math.random()*64-32, y: Math.random()*64-32},
      randomOffsetBottom: {x: Math.random()*64-32, y: Math.random()*64-32},
      translate: {x: 0, y: 0},
    }
  },

  methods: {
    update(){
      this.$nextTick(() => {
        let offsetFade = (window.pageYOffset - this.$refs.el.offsetTop) / window.innerHeight;

        let randomX = this.randomOffsetTop.x * (1 - offsetFade) + this.randomOffsetBottom.x * offsetFade
        let randomY = this.randomOffsetTop.y * (1 - offsetFade) + this.randomOffsetBottom.y * offsetFade

        this.translate.x = randomX
        this.translate.y = randomY

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