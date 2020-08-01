<template>
  <div>
  </div>
</template>

<script>
  export default {
    auth: true,
    mounted() {
      //this.$auth.login()
      this.$router.push('/collections')
    },
  }
</script>

<style lang="scss" scoped>

</style>