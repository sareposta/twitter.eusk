<template>
    <div>
    </div>
</template>

<script>
    export default {
       mounted () {
           this.$auth.loginWith('auth0', { params: { prompt: 'login', ui_locales: 'es' } })
       } 
    }
</script>

<style lang="scss" scoped>

</style>