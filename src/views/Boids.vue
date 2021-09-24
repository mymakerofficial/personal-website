<template>
  <BoidsBackground></BoidsBackground>
</template>

<script>
import BoidsBackground from "@/components/BoidsBackground";
export default {
  name: "Boids",
  components: {BoidsBackground},

  created() {
    setTimeout(() => {
      document.debug.show()
    },1000)
  },
}
</script>

<style scoped>

</style>