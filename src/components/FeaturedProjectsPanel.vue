<template>
  <Panel>
    <span v-for="project in projects" :key="project.name" :project="project">
      <router-link :to="{ name: 'project', params: { name: project.name } }" style="text-decoration: none !important;">
        <div class="card">
          <div class="cardThumbnail" :style="{backgroundImage: `url(${project.thumbnail})`}"></div>
          <div class="cardBody">
            <h6>{{project.displayName}}</h6>
            <p class="primary">{{project.summary}}</p>
            <!--<router-link v-if="project.projectPage" :to="{ name: 'project', params: { name: project.name } }"><button>more <i class="mdi mdi-dots-horizontal"></i></button></router-link><a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>-->
          </div>
        </div>
      </router-link>
    </span>

    <!--<div class="card">
      <div class="cardBigButton">
        <h1><i class="mdi mdi-dots-horizontal"></i></h1>
      </div>
    </div>-->
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