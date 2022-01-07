<template>
  <div>
    <Panel>
      <h1>My Work</h1>
      <br>
      <h6>Look! I did something.</h6>
    </Panel>
    <FeaturedProjectsPanel></FeaturedProjectsPanel>
    <ProjectListPanel></ProjectListPanel>
  </div>
</template>

<script>
import ProjectListPanel from "@/components/ProjectListPanel";
import FeaturedProjectsPanel from "@/components/FeaturedProjectsPanel";
import Panel from "@/components/Panel";
export default {
  name: "Projects",
  components: {Panel, FeaturedProjectsPanel, ProjectListPanel}
}
</script>

<style scoped>

</style>