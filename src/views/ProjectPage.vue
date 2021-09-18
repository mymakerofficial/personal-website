<template>
  <div>
    <Panel>
      <div v-html="this.content"></div>
      <div class="panelBody">
        <div class="smallSection">
          <ProjectDetails :project="project"></ProjectDetails>
        </div>
        <a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>
      </div>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import ProjectDetails from "@/components/ProjectDetails";
import axios from "axios";
import {markdown} from "@/js/markdown";

export default {
  name: "ProjectPage",
  components: {ProjectDetails, Panel},

  data() {
    return {
      project: this.$store.getters["projects/getByName"](this.$route.params.name),
      content: ""
    }
  },

  methods: {
    start() {
      axios.get(`/data/project-pages/${this.project.name}.md`).then(response => {
        this.content = markdown(response.data)
      }).catch(error => {
        console.log(error)
      })
    }
  },

  created() {
    this.start()
  }
}
</script>

<style scoped>

</style>