<template>
  <Panel>
    <span v-for="project in projects" :key="project.name" :project="project">
      <router-link :to="{ name: 'project', params: { name: project.name } }" style="text-decoration: none !important;">
        <div class="card" :style="{transform: `translate(${Math.random()*64-32}px,${Math.random()*64-32}px)`}">
          <div class="cardThumbnail" :style="{backgroundImage: `url(${project.thumbnail})`}"></div>
          <div class="cardBody">
            <h6>{{project.displayName}}</h6>
            <p class="primary">{{project.summary}}</p>
          </div>
        </div>
      </router-link>
    </span>
  </Panel>
</template>

<script>
import Panel from "@/components/Panel";
export default {
  name: "FeaturedProjectsPanel",
  components: {Panel},
  data() {
    return {
      projects: this.$store.state.projects.list.filter(p => p.featured)
    }
  },
}
</script>

<style scoped>

</style>