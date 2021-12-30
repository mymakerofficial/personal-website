<template>
  <div>
    <Panel>
      <h1>Projects</h1>
      <br>
      <span v-for="project in projects" :key="project.name" :project="project">
        <MouseDistanceAnimationElement distance="200" amount="64">
          <router-link :to="{ name: 'project', params: { name: project.name } }" style="text-decoration: none !important;">
            <h6><i class="mdi mdi-arrow-right"></i> {{project.displayName}}</h6>
            <p class="primary">{{project.summary}}</p>
            <br>
          </router-link>
        </MouseDistanceAnimationElement>
      </span>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import MouseDistanceAnimationElement from "@/components/MouseDistanceAnimationElement";
export default {
  name: "ProjectListPanel",
  components: {MouseDistanceAnimationElement, Panel},

  data() {
    return {
      projects: this.$store.state.projects.list,
    }
  },
}
</script>

<style scoped>

</style>