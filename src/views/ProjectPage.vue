<template>
  <div>
    <Panel>
      <div v-html="this.readme"></div>
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
export default {
  name: "ProjectPage",
  components: {ProjectDetails, Panel},

  data() {
    return {
      project: this.$store.getters["projects/getByName"](this.$route.params.name),
      readme: ""
    }
  },

  methods: {
    start() {
      this.readme = this.$store.getters["projects/readme/getHtml"](this.project.name)
    }
  },

  created() {
    this.$store.dispatch("projects/readme/load", this.project.name).then(() => {
      this.start()
    });
  }
}
</script>

<style scoped>

</style>