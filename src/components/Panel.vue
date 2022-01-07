<template>
  <div :class="{'panel': true, 'fullPage': fullPage}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["fullPage"],

  name: "Panel"
}
</script>

<style scoped>

</style>