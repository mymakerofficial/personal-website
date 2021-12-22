<template>
  <div>
    <div class="projectHeader">
      <img :src="project.thumbnail" class="projectHeaderImage">
      <div class="projectHeaderTitle">
        <a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>
      </div>
    </div>
    <div class="textContainer" v-html="this.content"></div>
    <div class="smallSection">
      <ProjectDetails :project="project"></ProjectDetails>
    </div>
  </div>
</template>

<script>
import ProjectDetails from "@/components/ProjectDetails";
import axios from "axios";
import {markdown} from "@/js/markdown";

export default {
  name: "ProjectPage",
  components: {ProjectDetails},

  data() {
    return {
      project: this.$store.getters["projects/getByName"](this.$route.params.name),
      content: "",
      config: {}
    }
  },

  methods: {
    start() {

    },
    applyConfig() {
      let style = ``
      if(this.config.textColor !== null) style += `--colorText: ${this.config.textColor};`
      if(this.config.headerColor !== null) style += `--colorHeader: ${this.config.headerColor};`
      if(this.config.linkColor !== null) style += `--colorLink: ${this.config.linkColor};`
      if(this.config.backgroundColor !== null) style += `--colorBackground: ${this.config.backgroundColor};`
      document.body.style = style
    },
    loadData() {
      axios.get(`/data/project-pages/${this.project.name}.md`).then(response => {
        this.content = markdown(response.data)
      }).catch(error => {
        console.log(error)
      })
      /*
      axios.get(`/data/project-pages/${this.project.name}.json`).then(response => {
        this.config = response.data
        this.applyConfig()
      }).catch(error => {
        console.log(error)
      })

       */
    }
  },

  created() {
    this.loadData()
  },

  beforeRouteLeave(to, from, next) {
    document.body.style = null
    next()
  },
}
</script>