<template>
  <div>
    <Panel>
      <h1>Projects</h1>
      <br>
      <span v-for="project in projects" :key="project.name" :project="project">
        <MouseDistanceAnimationElement distance="200" amount="64">
          <router-link :to="{ name: 'project', params: { name: project.name } }" style="text-decoration: none !important;">
            <h6><i class="mdi mdi-arrow-right"></i> {{project.displayName}} <span class="badge"><i class="mdi mdi-tag"></i> {{project.tags[0]}}</span> <span class="badge" v-if="!(new Date() < new Date(project.timespan.release * 1000))"><i class="mdi mdi-calendar"></i> {{project.timespan.year}}</span> <span class="badge" v-if="new Date() < new Date(project.timespan.release * 1000)"><i class="mdi mdi-calendar"></i> coming {{ new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(project.timespan.release * 1000))}} {{new Date(project.timespan.release * 1000).getFullYear()}}</span></h6>
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
  }
}
</script>

<style scoped>

</style>