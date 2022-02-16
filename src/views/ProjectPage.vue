<template>
  <div>
    <Panel>
      <div class="projectHeader">
        <img v-if="project.thumbnail !== ''" :src="project.thumbnail" class="projectHeaderImage" ref="thumbnailImage" @load="getColor" >
      </div>
      <div class="fluidCard" :style="{'--colorBackground': thumbnailColorBackground, 'background': thumbnailColorBackgroundGradient, '--colorText': thumbnailColorText}" v-if="showTitle">
        <div class="cardBody">
          <h5>{{ project.displayName }}</h5>
          <p class="primary">{{project.summary}}</p>
          <router-link :to="{name: 'playInBrowser', params: {name: this.$route.params.name}}" v-if="project.embed"><button>play now <i class="mdi mdi-play"></i></button></router-link> <a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>
          <!--<div><button class="noBorder">show more <i class="mdi mdi-chevron-down"></i></button></div>-->
        </div>
      </div>
    </Panel>
    <div class="fluidCard container textContainer" v-html="this.content" v-if="this.content"></div>
    <ProjectDetails :project="project"></ProjectDetails>
  </div>
</template>

<script>
import ProjectDetails from "@/components/ProjectDetails";
import axios from "axios";
import {markdown} from "@/js/markdown";
import ColorThief from "colorthief"
const colorThief = new ColorThief();

export default {
  name: "ProjectPage",
  components: {ProjectDetails},

  data() {
    return {
      project: this.$store.getters["projects/getByName"](this.$route.params.name),
      content: "",
      thumbnailColors: null,
      config: null,
    }
  },

  computed: {
    hasConfigColor() {
      if(this.config == null) return false
      return this.config.backgroundColorPrimary !== null && this.config.backgroundColorSecondary !== null && this.config.textColor !== null
    },
    thumbnailColorBackgroundGradient() {
      if(!this.thumbnailColors) return ''
      if(!this.project) return ''
      if(!this.project.thumbnail) return ''
      if(this.hasConfigColor) return `linear-gradient(153deg, ${this.config.backgroundColorPrimary} 0%, ${this.config.backgroundColorSecondary} 100%)`;
      return `linear-gradient(153deg, rgb(${this.thumbnailColors[0][0]}, ${this.thumbnailColors[0][1]}, ${this.thumbnailColors[0][2]}) 0%, rgb(${this.thumbnailColors[3][0]}, ${this.thumbnailColors[3][1]}, ${this.thumbnailColors[3][2]}) 100%)`;
    },
    thumbnailColorBackground() {
      if(!this.thumbnailColors) return ''
      if(!this.project) return ''
      if(!this.project.thumbnail) return ''
      if(this.hasConfigColor) return this.config.backgroundColorPrimary
      return `rgb(${this.thumbnailColors[0][0]}, ${this.thumbnailColors[0][1]}, ${this.thumbnailColors[0][2]})`;
    },
    thumbnailColorText() {
      if(!this.thumbnailColors) return ''
      if(!this.project) return ''
      if(!this.project.thumbnail) return ''

      let brightest = 0;

      for(let i = 1; i < this.thumbnailColors.length; i++){
        let a = this.thumbnailColors[i][0] + this.thumbnailColors[i][1] + this.thumbnailColors[i][2] / 3
        let b = this.thumbnailColors[brightest][0] + this.thumbnailColors[brightest][1] + this.thumbnailColors[brightest][2] / 3
        if(a > b) brightest = i;
      }

      if(this.hasConfigColor) return this.config.textColor
      return `rgb(${this.thumbnailColors[brightest][0]}, ${this.thumbnailColors[brightest][1]}, ${this.thumbnailColors[brightest][2]})`;
    },
    showTitle() {
      return this.thumbnailColorBackground !== '' && this.thumbnailColorText !== '' || !this.project.thumbnail
    }
  },

  methods: {
    start() {

    },
    getColor() {
      let img = this.$refs.thumbnailImage;
      img.crossOrigin = "Anonymous";

      try {
        this.thumbnailColors = colorThief.getPalette(img, 6)
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
      axios.get(`/data/project-pages/${this.project.name}.json`).then(response => {
        this.config = response.data
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