<template>
  <div>
    <div class="projectHeader">
      <img v-if="project.thumbnail !== ''" :src="project.thumbnail" class="projectHeaderImage" ref="thumbnailImage" @load="getColor" >
      <div class="projectHeaderTitle" :style="{'--colorBackground': thumbnailColorBackground, '--colorText': thumbnailColorText}">
        <h5>{{ project.displayName }}</h5>
        <p class="primary">{{project.summary}}</p>
        <a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>
      </div>
    </div>
    <!--<div class="textContainer" v-html="this.content"></div>
    <div class="smallSection">
      <ProjectDetails :project="project"></ProjectDetails>
    </div>-->
  </div>
</template>

<script>
//import ProjectDetails from "@/components/ProjectDetails";
import axios from "axios";
import {markdown} from "@/js/markdown";
import ColorThief from "colorthief"
const colorThief = new ColorThief();

export default {
  name: "ProjectPage",
  //components: {ProjectDetails},

  data() {
    return {
      project: this.$store.getters["projects/getByName"](this.$route.params.name),
      content: "",
      thumbnailColors: null
    }
  },

  computed: {
    thumbnailColorBackground() {
      if(!this.thumbnailColors) return ''
      if(!this.project) return ''
      if(!this.project.thumbnail) return ''
      return `rgb(${this.thumbnailColors[0][0]}, ${this.thumbnailColors[0][1]}, ${this.thumbnailColors[0][2]})`;
    },
    thumbnailColorText() {
      if(!this.thumbnailColors) return ''
      if(!this.project) return ''
      if(!this.project.thumbnail) return ''
      return `rgb(${this.thumbnailColors[1][0]}, ${this.thumbnailColors[1][1]}, ${this.thumbnailColors[1][2]})`;
    }
  },

  methods: {
    start() {

    },
    getColor() {
      let img = this.$refs.thumbnailImage;
      img.crossOrigin = "Anonymous";

      try {
        this.thumbnailColors = colorThief.getPalette(img, 2)
      }
      catch (e) {
        this.thumbnailColors = null
      }
    },
    loadData() {
      axios.get(`/data/project-pages/${this.project.name}.md`).then(response => {
        this.content = markdown(response.data)
      }).catch(error => {
        console.log(error)
      })
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