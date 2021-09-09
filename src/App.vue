<template>
  <div id="app">
    <Panel>
      <h1>My_Maker</h1>
      <h6>> Programmer of dumb websites and games</h6>
      <h6>> Professional VR enjoyer</h6>
      <h6>> Parttime human beeing</h6>
      <h6>> also IT student</h6>
    </Panel>
    <Panel v-for="project in projects" :key="project.name">
      <h1>{{project.displayName}}</h1>
      <p>{{project.summary}}</p>
      <br>
      <a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}}</button></a>
      <div class="pillContainer"><span class="pill" v-for="tag in project.tags" :key="tag">{{tag}}</span></div>
      <div class="pillContainer"><span class="pill" v-for="position in project.positions" :key="position">{{position}}</span></div>
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
    loadData(){
      axios.get(`/data/projects.json`).then(response => {
        this.projects = response.data
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
