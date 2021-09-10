<template>
  <Panel :id="project.name">
    <div class="panelHeader">
      <h1>{{project.displayName}}</h1>
    </div>
    <div class="panelBody">
      <p class="primary">{{project.summary}}</p>
      <p class="secondary">{{project.description}}</p>
      <div class="smallSection">
        <div v-if="project.tags !== null && project.tags.length > 0">
          <label>tags</label>
          <div><span class="listItem" v-for="tag in project.tags" :key="tag">{{tag.toLowerCase()}}</span></div>
        </div>
        <div v-if="project.timespan.year">
          <label>development</label>
          <div><span class="listItem">{{project.timespan.year}}</span><span class="listItem">({{project.developmentStatus}})</span></div>
        </div>
        <div v-if="project.collaborators !== null && project.collaborators.length > 0">
          <label>collaborators</label>
          <div><span class="listItem" v-for="collaborator in project.collaborators" :key="collaborator.name">{{collaborator.name}}</span></div>
        </div>
        <div v-if="project.positions !== null && project.positions.length > 0">
          <label>position</label>
          <div><span class="listItem" v-for="position in project.positions" :key="position">{{position.toLowerCase()}}</span></div>
        </div>
      </div>
    </div>
    <div class="panelFooter">
      <a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>
    </div>
  </Panel>
</template>

<script>
import Panel from "@/components/Panel";
export default {
  name: "ProjectPanel",
  components: {Panel},

  props: ["project"]
}
</script>

<style scoped>

</style>