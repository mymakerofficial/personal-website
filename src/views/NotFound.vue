<template>
  <div>
    <BoidsBackground></BoidsBackground>
    <Panel>
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
        <h1>404</h1>
        <h5>Not Found</h5>
      </div>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import BoidsBackground from "@/components/BoidsBackground";

export default {
  name: "NotFound",
  components: {BoidsBackground, Panel}
}
</script>

<style scoped>

</style>