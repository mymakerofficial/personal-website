<template>
  <div>
    <BoidsBackground></BoidsBackground>
    <Panel>
      <div ref="head">
        <h1>My_Maker</h1>
        <h6><i class="mdi mdi-arrow-right"></i> Programmer of dumb websites and games</h6>
        <h6><i class="mdi mdi-arrow-right"></i> Sometimes designer</h6>
        <h6><i class="mdi mdi-arrow-right"></i> Professional VR enjoyer</h6>
        <h6><i class="mdi mdi-arrow-right"></i> Also IT student</h6>
      </div>
      <Tooltip tooltip="click me!" time="1000"><span class="hiddenButton" @click="debug">[debug]</span></Tooltip>
    </Panel>
    <ProjectPanel v-for="project in projects" :key="project.name" :project="project"></ProjectPanel>
    <Panel id="faq">
      <h2>FAQ</h2>
      <br>
      <h6>Can you fix my printer?</h6>
      <h6><i class="mdi mdi-arrow-right-bottom"></i> no.</h6>
      <br>
      <h6>What are you doing?</h6>
      <h6><i class="mdi mdi-arrow-right-bottom"></i> probably programming.</h6>
      <br>
      <h6>How are you?</h6>
      <h6><i class="mdi mdi-arrow-right-bottom"></i> tired.</h6>
      <br>
      <h6>Why are you?</h6>
      <h6><i class="mdi mdi-arrow-right-bottom"></i> yes.</h6>
    </Panel>
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
import Tooltip from "@/components/Tooltip";
import anime from "animejs";
import BoidsBackground from "@/components/BoidsBackground";

export default {
  name: 'Home',
  components: {BoidsBackground, Tooltip, ProjectPanel, Panel},

  data() {
    return {
      projects: this.$store.state.projects.list
    }
  },

  methods: {
    start(){
      this.$nextTick(() => {
        this.animate()
      })
    },
    animate() {
      anime.set(this.$refs.head.children,{
        opacity: 0
      })

      anime({
        targets: this.$refs.head.children,
        translateX: [-100, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(60, {start: 1000}),
        easing: 'easeOutElastic(0.1, 0.6)',
        autostart: true,
      })
    },
    debug() {
      document.debug.show()
    }
  },

  created() {
    this.start()

  },
}
</script>

<style scoped>

</style>
