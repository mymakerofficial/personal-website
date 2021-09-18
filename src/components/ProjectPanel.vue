<template>
  <Panel :id="project.name">
    <div class="panelHeader">
      <h1>{{project.displayName}}</h1>
    </div>
    <div class="panelBody">
      <p class="primary">{{project.summary}}</p>
      <p class="secondary">{{project.description}}</p>
      <div class="smallSection">
        <ProjectDetails :project="project"></ProjectDetails>
      </div>
    </div>
    <div class="panelFooter">
      <!--<router-link :to="{ name: 'project', params: { name: project.name } }"><button>more <i class="mdi mdi-dots-horizontal"></i></button></router-link>--><a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>
    </div>
  </Panel>
</template>

<script>
import Panel from "@/components/Panel";
import ProjectDetails from "@/components/ProjectDetails";

export default {
  name: "ProjectPanel",
  components: {ProjectDetails, Panel},

  props: ["project"],
}
</script>

<style scoped>

</style>