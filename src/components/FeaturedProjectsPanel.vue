<template>
  <Panel style="position: relative;" class="themeInverted">
    <h1 class="backgroundText"><span>Featured </span><span v-for="n in 100" :key="n">{{backgroundWords[Math.round(Math.random()*backgroundWords.length)]}} </span></h1>
    <h1>Featured</h1>
    <span v-for="project in projects" :key="project.name">
      <FeaturedProjectCard :project="project"></FeaturedProjectCard>
    </span>
  </Panel>
</template>

<script>
import Panel from "@/components/Panel";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
export default {
  name: "FeaturedProjectsPanel",
  components: {FeaturedProjectCard, Panel},

  data() {
    return {
      projects: this.$store.getters["projects/getFeatured"],
    }
  },

  computed: {
    backgroundWords: function () {
      return this.projects.map(p => p.displayName);
    }
  },
}
</script>

<style scoped>

</style>