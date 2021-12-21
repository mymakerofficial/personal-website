<template>
  <Panel>
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
      projects: this.$store.state.projects.list.filter(p => p.featured === true)
    }
  }
}
</script>

<style scoped>

</style>