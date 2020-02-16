<template>
    <div>
        <h1>{{essay}}</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            essay: {}
        }
    },
    created() {
      if (this.$route.query.content.id == null) this.goBack()
      this.$data.essay = this.$route.query.content
    }
}
</script>

<style scoped>

</style>