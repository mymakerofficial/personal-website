<template>
  <div>
    <iframe :src="project.embed" class="gameiframe" mozallowfullscreen="true" frameborder="0" scrolling="no" webkitallowfullscreen="true" msallowfullscreen="true" allowtransparency="true" id="game_drop" allowfullscreen="true"></iframe>
  </div>
</template>

<script>
export default {
  name: "ProjectEmbed",

  data() {
    return {
      project: this.$store.getters["projects/getByName"](this.$route.params.name)
    }
  },

  created() {
    if(!this.project.embed) this.$router.push({name: 'project', params: {name: this.$route.params.name}})
  }
}
</script>

<style scoped>
  .gameiframe {
    width: 100vw;
    height: 100vh;
    border: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
  }
</style>