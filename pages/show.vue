<template>
    <div>
<a class="twitter-timeline" :href="url"></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
</template>

<script>
    export default {
	layout: 'add',
        data () {
            return {
                url: 'https://twitter.com/santiblanko/timelines/' + this.$route.query.id + '?ref_src=twsrc%5Etfw'
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>