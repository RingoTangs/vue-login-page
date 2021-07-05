<template>
  <div>
    <h1>Home</h1>
    <div>
      {{ user }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: sessionStorage.getItem('user')
    }
  },
}
</script>

<style scoped>

</style>