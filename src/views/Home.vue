<template>
  <div>
    <div ref="backgroundCanvas" class="backgroundCanvas"></div>
    <Panel>
      <h1>My_Maker</h1>
      <h6><i class="mdi mdi-arrow-right"></i> Programmer of dumb websites and games</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Sometimes designer</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Professional VR enjoyer</h6>
      <h6><i class="mdi mdi-arrow-right"></i> Also IT student</h6>
      <Tooltip tooltip="click me!" time="1000"><span class="hiddenButton" @click="debug">[debug]</span></Tooltip>
    </Panel>
    <ProjectPanel v-for="project in projects" :key="project.name" :project="project"></ProjectPanel>
    <Panel>
      <h2>Links</h2>
      <h6><a href="https://github.com/mymakerofficial" target="_blank">GitHub<i class="mdi mdi-arrow-top-right"></i></a></h6>
      <h6><a href="https://my-maker.itch.io/" target="_blank">itch.io<i class="mdi mdi-arrow-top-right"></i></a></h6>
      <h6><a href="https://www.youtube.com/channel/UCXv_YqyPVOSNocCS8fmu8Hw" target="_blank">YouTube<i class="mdi mdi-arrow-top-right"></i></a></h6>
      <h6><Tooltip tooltip="Please tell me why my stuff is always offline" time="2500"><a href="http://status.maiker.de" target="_blank">Status Page<i class="mdi mdi-arrow-top-right"></i></a></Tooltip></h6>
      <br><br><br>
      <h2>Contact</h2>
      <h6><a>root[at]maiker.de</a></h6>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import ProjectPanel from "@/components/ProjectPanel";
import background from "@/js/background";
import Tooltip from "@/components/Tooltip";

export default {
  name: 'Home',
  components: {Tooltip, ProjectPanel, Panel},

  data() {
    return {
      projects: this.$store.state.projects.list
    }
  },

  methods: {
    start(){
      this.$nextTick(() => {
        background.setup(this.$refs.backgroundCanvas)
        background.render()
      })
    },
    resize() {
      background.resize()
    },
    debug() {
      document.debug.show()
    }
  },

  created() {
    this.start()
    window.addEventListener("resize", this.resize);
  },

  destroyed() {
    window.removeEventListener("resize", this.resize);
  }
}
</script>

<style lang="scss">
@import "../sass/app";
</style>
