<template>
  <div id="app">
    <Panel>
      <h1>My_Maker</h1>
      <h6><i class="mdi mdi-arrow-right"></i> Programmer of dumb websites and games</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Sometimes designer</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Professional VR enjoyer</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Also IT student</h6>
    </Panel>
    <Panel v-for="project in projects" :key="project.name" :id="project.name">
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
    <Panel>
      <h2>Links</h2>
      <h6><a href="https://github.com/mymakerofficial" target="_blank">GitHub<i class="mdi mdi-arrow-top-right"></i></a></h6>
      <h6><a href="https://my-maker.itch.io/" target="_blank">itch.io<i class="mdi mdi-arrow-top-right"></i></a></h6>
      <h6><a href="https://www.youtube.com/channel/UCXv_YqyPVOSNocCS8fmu8Hw" target="_blank">YouTube<i class="mdi mdi-arrow-top-right"></i></a></h6>
      <br><br><br>
      <h2>Contact</h2>
      <h6><a>root[at]maiker.de</a></h6>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import axios from "axios";

export default {
  name: 'App',
  components: {Panel},

  data() {
    return {
      projects: {}
    }
  },

  methods: {
    start(){
      console.log(this.formatTimespan({
        "started": 1615762800,
        "finished": null,
        "year": "2021"
      }))
    },
    loadData(){
      axios.get(`/data/projects.json`).then(response => {
        this.projects = response.data
        this.start()
      }).catch(error => {
        console.log(error)
      })
    },
  },

  created() {
    this.loadData();
  }
}
</script>

<style lang="scss">
@import "./sass/app.scss";
</style>
