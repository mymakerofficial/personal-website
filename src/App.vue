<template>
  <div id="app">
    <div ref="backgroundCanvas" class="backgroundCanvas"></div>
    <Panel>
      <h1>My_Maker</h1>
      <h6><i class="mdi mdi-arrow-right"></i> Programmer of dumb websites and games</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Sometimes designer</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Professional VR enjoyer</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Also IT student</h6>
    </Panel>
    <ProjectPanel v-for="project in projects" :key="project.name" :project="project"></ProjectPanel>
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
import ProjectPanel from "@/components/ProjectPanel";
import background from "@/js/background";

export default {
  name: 'App',
  components: {ProjectPanel, Panel},

  data() {
    return {
      projects: {}
    }
  },

  methods: {
    start(){
      document.background = background;
      console.log(background)

      background.setup(this.$refs.backgroundCanvas)

      background.render()
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
